import JSSoup from 'jssoup';
import axios from 'axios';
import { sleepRandomTime } from './sleep-random-time';
import { sleep } from './sleep';

const FIVE_MINUTES_MS = 1000 * 60 * 5;

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
      .filter(Boolean);
  } catch (error) {
    await sleep(FIVE_MINUTES_MS);

    return fetchDetailsPage(url);
  }

  return result;
}
