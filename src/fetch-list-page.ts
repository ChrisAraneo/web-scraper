import JSSoup from 'jssoup';
import axios from 'axios';
import { sleepRandomTime } from './sleep-random-time';

export async function fetchListPage(url: string): Promise<string[]> {
  let ids: string[] = [];

  try {
    await sleepRandomTime();

    const response = await axios.get(url);
    const soup = new JSSoup(response.data);
    const rows = soup.findAll('tr');
    ids = rows.map((row) => row.attrs?.id).filter(Boolean);
  } catch (error) {
    console.error('Error scraping website:', url, error);
  }

  return ids;
}
