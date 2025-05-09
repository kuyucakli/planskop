use candle::{DType, Device, Tensor};
use candle_nn::VarBuilder;
use candle_transformers::{generation::LogitsProcessor, models::llama as model};
use hf_hub::{api::sync::Api, Repo, RepoType};
use model::{Llama, LlamaConfig};
use std::io::Write;
use tokenizers::Tokenizer;

const EOS_TOKEN: &str = "</s>";

pub fn test() -> Result<(), Box<dyn std::error::Error>> {
    // The initial prompt.
    let prompt = "I enjoy Rust because ";
    // The length of the sample to generate (in tokens).
    let sample_len: usize = 100;
    // The seed to use when generating random samples.
    let seed = 7;

    // The temperature used to generate samples.
    let temperature: Option<f64> = None;
    // Nucleus sampling probability cutoff.
    let top_p: Option<f64> = None;
    // Penalty to be applied for repeating tokens, 1. means no penalty.
    let repeat_penalty: f32 = 1.0;
    // The context size to consider for the repeat penalty.
    let repeat_last_n: usize = 64;

    let device = Device::Cpu;
    let dtype = DType::F16;
    let (llama, tokenizer_filename, mut cache) = {
        let api = Api::new()?;
        let model_id = "meta-llama/Llama-2-7b-hf".to_string();
        println!("loading the model weights from {model_id}");
        let revision = "main".to_string();
        let api = api.repo(Repo::with_revision(model_id, RepoType::Model, revision));

        let tokenizer_filename = api.get("tokenizer.json")?;

        let config_filename = api.get("config.json")?;
        let config: LlamaConfig = serde_json::from_slice(&std::fs::read(config_filename)?)?;
        let config = config.into_config(false);

        let mut filenames = vec![];
        for rfilename in [
            "model-00001-of-00002.safetensors",
            "model-00002-of-00002.safetensors",
        ] {
            let filename = api.get(rfilename)?;
            filenames.push(filename);
        }

        println!("building the model");
        let cache = model::Cache::new(true, dtype, &config, &device)?;

        let vb = unsafe { VarBuilder::from_mmaped_safetensors(&filenames, dtype, &device)? };
        (Llama::load(vb, &config)?, tokenizer_filename, cache)
    };
    let tokenizer = Tokenizer::from_file(tokenizer_filename)
        .map_err(|e| format!("Error loading tokenizer: {e}"))?;
    let eos_token_id = tokenizer.token_to_id(EOS_TOKEN);
    let mut tokens = tokenizer
        .encode(prompt, true)
        .map_err(|e| format!("Error encoding tokenizer: {e}"))?
        .get_ids()
        .to_vec();

    println!("starting the inference loop");
    print!("{prompt}");
    let mut logits_processor = LogitsProcessor::new(seed, temperature, top_p);
    let start_gen = std::time::Instant::now();
    let mut index_pos = 0;
    let mut token_generated = 0;
    for index in 0..sample_len {
        let context_size = if cache.use_kv_cache && index > 0 {
            1
        } else {
            tokens.len()
        };
        let ctxt = &tokens[tokens.len().saturating_sub(context_size)..];
        let input = Tensor::new(ctxt, &device)?.unsqueeze(0)?;
        let logits = llama.forward(&input, index_pos, &mut cache)?;
        let logits = logits.squeeze(0)?;
        let logits = if repeat_penalty == 1. {
            logits
        } else {
            let start_at = tokens.len().saturating_sub(repeat_last_n);
            candle_transformers::utils::apply_repeat_penalty(
                &logits,
                repeat_penalty,
                &tokens[start_at..],
            )?
        };
        index_pos += ctxt.len();

        let next_token = logits_processor.sample(&logits)?;
        token_generated += 1;
        tokens.push(next_token);

        // Extracting the last token as a string is complicated, here we just apply some simple
        // heuristics as it seems to work well enough for this example. See the following for more
        // details:
        // https://github.com/huggingface/tokenizers/issues/1141#issuecomment-1562644141
        if let Some(text) = tokenizer.id_to_token(next_token) {
            let text = text.replace('▁', " ").replace("<0x0A>", "\n");
            print!("{text}");
            std::io::stdout().flush()?;
        }
        if Some(next_token) == eos_token_id {
            break;
        }
    }
    let dt = start_gen.elapsed();
    println!(
        "\n\n{} tokens generated ({} token/s)\n",
        token_generated,
        token_generated as f64 / dt.as_secs_f64(),
    );
    Ok(())
}
