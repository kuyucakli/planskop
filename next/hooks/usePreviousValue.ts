import { useEffect, useRef } from "react";

export default function usePrevious<T>(
  value: T,
  prevValDefault?: T
): T | undefined {
  const ref = useRef<T | undefined>(prevValDefault);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
