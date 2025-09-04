export async function randomDelay(): Promise<void> {
  const minDelay = 250;
  const maxDelay = 1500;
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;

  return new Promise(resolve => setTimeout(resolve, delay));
}
