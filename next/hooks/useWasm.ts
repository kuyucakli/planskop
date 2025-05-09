import { useEffect, useState } from 'react';
import { format_ical, get_closest_action_dates, get_local_now, get_timezones, get_local_timezone, get_human_readable_rrule, subtract_gmt_offset } from '@/pkg/planskop_rust';


export function useWasm() {
    const [wasmModule, setWasmModule] = useState<{ format_ical: typeof format_ical, get_local_now: typeof get_local_now, get_closest_action_dates: typeof get_closest_action_dates, get_timezones: typeof get_timezones, get_local_timezone: typeof get_local_timezone, get_human_readable_rrule: typeof get_human_readable_rrule, subtract_gmt_offset: typeof subtract_gmt_offset } | null>();

    useEffect(() => {
        const loadWasm = async () => {
            const _wasmModule = await import('@/pkg/planskop_rust');
            //const wasmBgModule = await import('@/pkg/planskop_rust_bg.wasm');
            setWasmModule(_wasmModule);
        };
        loadWasm();
    }, []);

    return wasmModule;
}