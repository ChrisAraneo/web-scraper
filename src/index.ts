import { config } from 'dotenv';
import * as path from 'path';
import { fetchListPage } from './fetch-list-page';
import { fetchDetailsPage } from './fetch-details-page';
import { writeFile } from './write-file';
import { createDirWhenMissing } from './create-dir-when-missing';
import { logger } from './logger';
import { forkJoin, mergeMap, tap } from 'rxjs';

config();

if (!process.env.LIST_URL) {
  logger.error('LIST_URL is not defined');
  process.exit(1);
}

if (!process.env.DETAILS_URL) {
  logger.error('DETAILS_URL is not defined');
  process.exit(1);
}

if (!process.env.REGION) {
  logger.error('REGION is not defined');
  process.exit(1);
}

if (!process.env.OUTPUT_DIR) {
  logger.error('OUTPUT_DIR is not defined');
  process.exit(1);
}

if (!process.env.SAVE_INTERVAL) {
  logger.error('SAVE_INTERVAL is not defined');
  process.exit(1);
}

const first = 0;
const last = 3;

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

    fetchListPage(url)
      .pipe(
        mergeMap((ids) =>
          forkJoin(
            ids.map((id) =>
              fetchDetailsPage(
                `${DETAILS_URL}/${REGION}/${id}#championsData-all`,
              ),
            ),
          ).pipe(
            tap(() => logger.info(`Scrapped page ${i + 1}`)),
          ),
        ),
      )
      .subscribe((values) => {
        values.forEach((detail) => {
          result.push(detail);
          currentBatch.push(detail);

          if ((i + 1) % SAVE_INTERVAL === 0 || i === last - 1) {
            if (currentBatch.length > 0) {
              writeFile(
                currentBatch,
                path.join(OUTPUT_DIR, `results_${REGION}_${fileCounter}.json`),
              ).then((saveSuccess) => {
                if (saveSuccess) {
                  fileCounter++;
                  currentBatch = [];
                  result.length = 0;
                }
              });
            }
          }
        });
      });
  }
}

main();
