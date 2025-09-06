import JSSoup from 'jssoup';
import axios from 'axios';
import { sleep } from './sleep';
import { logger } from './logger';

const TEN_MINUTES_MS = 1000 * 60 * 10;

export async function fetchListPage(url: string): Promise<string[]> {
  let ids: string[] = [];

  try {
    const response = await axios.get(encodeURI(url));
    const soup = new JSSoup(response.data);
    const rows = soup.findAll('tr');
    ids = rows.map((row) => row.attrs?.id).filter(Boolean);
  } catch (error) {
    logger.error(`Error fetching list page ${url}. Retrying...`);
    await sleep(TEN_MINUTES_MS);

    return fetchListPage(url);
  }

  return ids;
}
