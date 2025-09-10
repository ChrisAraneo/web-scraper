import { config } from 'dotenv';
import * as path from 'path';
import { fetchListPage } from './fetch-list-page';
import { fetchDetailsPage } from './fetch-details-page';
import { createDirWhenMissing } from './utils/create-dir-when-missing';
import { logger } from './utils/logger';
import { forkJoin, mergeMap, tap } from 'rxjs';
import { chunk } from 'lodash';
import { writeFile } from './utils/write-file';

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

if (!process.env.OUTPUT_DIR) {
  logger.error('OUTPUT_DIR is not defined');
  process.exit(1);
}

if (!process.env.FIRST) {
  logger.error('FIRST is not defined');
  process.exit(1);
}

if (!process.env.LAST) {
  logger.error('LAST is not defined');
  process.exit(1);
}

const FIRST = parseInt(process.env.FIRST, 0);
const LAST = parseInt(process.env.LAST, 99);

const LIST_URL = process.env.LIST_URL!;
const DETAILS_URL = process.env.DETAILS_URL!;
const REGION = process.env.REGION!;
const OUTPUT_DIR = process.env.OUTPUT_DIR!;

createDirWhenMissing(OUTPUT_DIR);

async function main() {
  const zeros = Array(LAST - FIRST + 1).fill(0);

  const observables = zeros.map((_, index) => {
    const url: string = `${LIST_URL}?region=${REGION}&page=${index + FIRST}`;

    return fetchListPage(url).pipe(
      mergeMap((ids) =>
        forkJoin(
          ids.map((id) =>
            fetchDetailsPage(
              `${DETAILS_URL}/${REGION}/${id}#championsData-all`,
            ).pipe(tap(() => logger.info(`Scrapped details page for ${id}`))),
          ),
        ),
      ),
      tap(() => logger.info(`Scrapped whole list ${index + FIRST}`)),
    );
  });

  chunk(observables, 10).forEach((chunk, index) => {
    forkJoin(chunk).subscribe((values) => {
      writeFile(
        values,
        `${path.join(OUTPUT_DIR, `results_${REGION}`)}_${index}`,
      );
    });
  });
}

main();
