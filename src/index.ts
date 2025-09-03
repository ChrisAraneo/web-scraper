import { config } from 'dotenv';
import * as path from 'path';
import { fetchListPage } from './fetch-list-page';
import { fetchDetailsPage } from './fetch-details-page';
import { writeFile } from './write-file';
import { createDirWhenMissing } from './create-dir-when-missing';

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

if (!process.env.OUTPUT_DIR) {
  console.error('OUTPUT_DIR is not defined');
  process.exit(1);
}

if (!process.env.SAVE_INTERVAL) {
  console.error('SAVE_INTERVAL is not defined');
  process.exit(1);
}

const first = 0;
const last = 1;

const LIST_URL = process.env.LIST_URL!;
const DETAILS_URL = process.env.DETAILS_URL!;
const REGION = process.env.REGION!;
const OUTPUT_DIR = process.env.OUTPUT_DIR!;
const SAVE_INTERVAL = parseInt(process.env.SAVE_INTERVAL!);

const result: any[] = [];

createDirWhenMissing(OUTPUT_DIR);

async function main() {
  let fileCounter = 1;
  let currentBatch: any[] = [];

  for (let i = first; i < last; i++) {
    const url: string = `${LIST_URL}?region=${REGION}&page=${i}`;
    const list = await fetchListPage(url);
    const details = list.map((id) => {
      return fetchDetailsPage(`${DETAILS_URL}/${REGION}/${id}/champions`);
    });

    const values = await Promise.all(details);
    values.forEach((detail) => {
      result.push(detail);
      currentBatch.push(detail);
    });

    console.log(`⏳ Scrapped ${i + 1} of ${last} pages...`);

    if ((i + 1) % SAVE_INTERVAL === 0 || i === last - 1) {
      if (currentBatch.length > 0) {
        const saveSuccess = await writeFile(
          currentBatch,
          path.join(OUTPUT_DIR, `results_${REGION}_${fileCounter}.json`),
        );

        if (saveSuccess) {
          fileCounter++;
          currentBatch = [];
          result.length = 0;
          console.log(`🧹 Cleared result array to free memory`);
        }
      }
    }
  }

  console.log(`🎉 Scraping completed!`);
  console.log(
    `📁 Results saved in ${fileCounter - 1} file(s) in the '${OUTPUT_DIR}' directory`,
  );
}

main();
