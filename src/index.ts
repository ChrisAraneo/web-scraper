import { config } from 'dotenv';
import * as path from 'path';
import { fetchLeaderboardsPage } from './fetch-leaderboards-page';
import { fetchDetailsPage } from './fetch-details-page';
import { createDirectoryWhenDoesntExist } from './utils/create-directory-when-doesnt-exist';
import { logger } from './utils/logger';
import { forkJoin, mergeMap, tap } from 'rxjs';
import { chunk } from 'lodash';
import { writeFile } from './utils/write-file';
import { getEnvOrExitProcess } from './utils/get-env-or-exit-process';
import { fetchBestPlayersPage } from './fetch-best-players-page';

config();

const LEADERBOARDS_URL = getEnvOrExitProcess('LEADERBOARDS_URL');
const DETAILS_URL = getEnvOrExitProcess('DETAILS_URL');
const BEST_PLAYERS_URL = getEnvOrExitProcess('BEST_PLAYERS_URL');
const CHARACTER = getEnvOrExitProcess('CHARACTER');
const REGION = getEnvOrExitProcess('REGION');
const OUTPUT_DIR = getEnvOrExitProcess('OUTPUT_DIR');
const FIRST = Number(getEnvOrExitProcess('FIRST'));
const LAST = Number(getEnvOrExitProcess('LAST'));

createDirectoryWhenDoesntExist(OUTPUT_DIR);

async function fetchLeaderboardsAndDetails() {
  const zeros = Array(LAST - FIRST + 1).fill(0);

  const observables = zeros.map((_, index) => {
    const url: string = `${LEADERBOARDS_URL}?region=${REGION}&page=${index + FIRST}`;

    return fetchLeaderboardsPage(url).pipe(
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

async function fetchBestPlayers() {
  const zeros = Array(LAST - FIRST + 1).fill(0);

  const observables = zeros.map((_, index) => {
    const url: string = `${BEST_PLAYERS_URL}/${CHARACTER}/by-played/page-${index + FIRST}`;

    return fetchBestPlayersPage(url).pipe(
      tap(() =>
        logger.info(
          `Scrapped best players page number ${index + FIRST} for ${CHARACTER}`,
        ),
      ),
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

fetchBestPlayers();
