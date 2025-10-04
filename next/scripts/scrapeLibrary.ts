import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const sources = [
  "https://jamesclear.com/atomic-habits",
  "https://charlesduhigg.com/the-power-of-habit/",
  "https://tinyhabits.com/book/",
  "https://www.calnewport.com/books/deep-work/",
  "https://www.nirandfar.com/indistractable/",
  "https://gregmckeown.com/books/essentialism/",
  "https://www.franklincovey.com/the-7-habits/",
  "https://carolinedweck.com/books/mindset/",
  "https://jamesclear.com/articles",
  "https://fs.blog/habits/",
  "https://behaviormodel.org/",
  "https://www.nirandfar.com/",
  "https://hbr.org/2019/06/to-change-habits-stop-focusing-on-motivation",
  "https://www.newyorker.com/magazine/2012/03/05/the-power-of-habit",
  "https://medium.com/better-humans/the-science-of-building-better-habits-7ae5d10f15f",
  "https://doi.org/10.1146/annurev.psych.093008.100519",
  "https://onlinelibrary.wiley.com/doi/10.1002/ejsp.674",
  "https://www.apa.org/monitor/2019/07-08/habits",
  "https://captology.stanford.edu/projects/behavior.html",
  "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6382193/",
];

async function scrapeMeta(url: string) {
  try {
    const { data } = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(data);

    const title =
      $('meta[property="og:title"]').attr("content") || $("title").text() || "";
    const excerpt =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";
    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    return { url, title, excerpt, image };
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Error scraping:", url, err.message);
    } else {
      console.error("❌ Unknown error scraping:", url, err);
    }
    return { url, title: "", excerpt: "", image: "" };
  }
}

async function run() {
  const results = [];
  for (const url of sources) {
    console.log("Scraping:", url);
    const meta = await scrapeMeta(url);
    results.push(meta);
  }

  fs.writeFileSync("library.json", JSON.stringify(results, null, 2));
  console.log("✅ library.json created with", results.length, "entries");
}

run();
