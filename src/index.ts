import { config } from 'dotenv';
import axios from 'axios';
import JSSoup from 'jssoup';

config();

if (!process.env.LIST_URL) {
  console.error('LIST_URL is not defined');
  process.exit(1);
}

if (!process.env.DETAILS_URL) {
  console.error('DETAILS_URL is not defined');
  process.exit(1);
}

if (!process.env.REGION) {
  console.error('REGION is not defined');
  process.exit(1);
}

const result: any[] = [];
const total = 1;

async function main() {
  for (let i = 0; i < total; i++) {
    const url: string = `${process.env.LIST_URL}?region=${process.env.REGION}&page=${i}`;
    const list = await fetchListPage(url);
    const details = list.map((id) => {
      return fetchDetailsPage(`${process.env.DETAILS_URL}/${process.env.REGION}/${id}/champions`);
    });

    Promise.all(details).then((values) => {
      values.forEach((detail) => {
        result.push(detail);
      });
    });

    console.log(`Scrapped ${i} of ${total}`);
  }
}

async function fetchListPage(url: string): Promise<string[]> {
  let ids: string[] = [];

  try {
    const response = await axios.get(url);
    const soup = new JSSoup(response.data);
    const rows = soup.findAll('tr');
    ids = rows.map((row) => row.attrs?.id).filter(Boolean);
  } catch (error) {
    console.error('Error scraping website:', url);
  }

  return ids;
}

async function fetchDetailsPage(url: string): Promise<string[]> {
  let result: string[] = [];

  try {
    const response = await axios.get(url);
    const soup = new JSSoup(response.data);
    const items = soup.findAll('tr');
    result = items.filter((item) => item.attrs?.class === 'cursor-pointer').map((item) => item.getText('|')).filter(Boolean);
  } catch (error) {
    console.error('Error scraping website:', url);
  }

  return result;
}

main();
