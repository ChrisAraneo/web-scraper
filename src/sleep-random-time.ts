export async function sleepRandomTime(): Promise<void> {
  const min = 0;
  const max = 1500;

  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
}
