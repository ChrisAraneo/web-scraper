import { logger } from './utils/logger';
import { getWebsite } from './get-website';
import { catchError, delay, map, Observable, tap } from 'rxjs';
import { get } from 'lodash';
import { TEN_MINUTES_MS } from './utils/consts';

export function fetchLeaderboardsPage(url: string): Observable<string[]> {
  const logError = (error: unknown) =>
    tap(() =>
      logger.error(
        `Error fetching leaderboards page ${url}. Status: ${get(error, 'status', 'unknown')}. Retrying...`,
      ),
    );
  const delayTenMinutes = delay(TEN_MINUTES_MS);

  return getWebsite(url).pipe(
    map((soup) =>
      soup
        .findAll('tr')
        .map((tr) => tr.attrs?.id)
        .filter(Boolean),
    ),
    catchError((error) => {
      logError(error);

      return fetchLeaderboardsPage(url).pipe(delayTenMinutes);
    }),
  );
}
