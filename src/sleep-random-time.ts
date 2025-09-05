import { sleep } from "./sleep";

export async function sleepRandomTime(): Promise<void> {
  const min = 0;
  const max = 1500;

  return sleep(Math.random() * (max - min) + min);
}
