import JSSoup from 'jssoup';
import axios from 'axios';
import { sleepRandomTime } from './sleep-random-time';
import { sleep } from './sleep';
import { logger } from './logger';

const TEN_MINUTES_MS = 1000 * 60 * 10;

export async function fetchDetailsPage(url: string): Promise<string[]> {
  let result: string[] = [];

  try {
    await sleepRandomTime();

    const response = await axios.get(url);
    const soup = new JSSoup(response.data);
    const items = soup.findAll('tr');
    result = items
      .filter((item) => item.attrs?.class === 'cursor-pointer')
      .map((item) => item.getText('|'))
      .filter(Boolean)
      .map((text) => `${url}|${text}`);
  } catch (error) {
    logger.error(`Error fetching details page ${url}. Retrying...`);
    await sleep(TEN_MINUTES_MS);

    return fetchDetailsPage(url);
  }

  return result;
}
