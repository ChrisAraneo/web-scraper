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

    const response = await axios.get(encodeURI(url));
    const soup = new JSSoup(response.data);
    const items = soup.findAll('tr');
    result = items.map((item) => item.getText('|'))
      .filter(Boolean)
      .map((text) => `${url}|${text}`);
  } catch (error) {
    if (!error?.status || error?.status === 429 || error?.status / 100 === 5) {
      logger.error(`Error fetching details page ${url}. Status: ${error?.status}. Retrying...`);
      await sleep(TEN_MINUTES_MS);

      return fetchDetailsPage(url);
    }

    logger.error(`Error fetching details page ${url}. Status: ${error?.status}`);
  }

  return result;
}
