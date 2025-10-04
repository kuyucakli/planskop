function getLocalNowMs() {
  const now = new Date();
  const localMs = now.getTime() - now.getTimezoneOffset() * 60_000;
  return localMs;
}

function convertUtcMsToLocalMs(utcMs: number) {
  const dt = new Date(utcMs);
  const localMs = dt.getTime() - dt.getTimezoneOffset() * 60_000;
  return localMs;
}

export { convertUtcMsToLocalMs, getLocalNowMs };
