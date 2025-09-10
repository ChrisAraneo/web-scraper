export function shouldRetry(data: any): boolean {
  return !data?.status || data.status === 429 || data.status / 100 === 5;
}
