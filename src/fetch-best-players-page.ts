import { logger } from './utils/logger';
import { getWebsite } from './get-website';
import { catchError, delay, map, Observable, tap } from 'rxjs';
import { get } from 'lodash';
import { TEN_MINUTES_MS } from './utils/consts';

export function fetchBestPlayersPage(url: string): Observable<string[]> {
  console.log('Fetching best players from URL:', url);

  const logError = (error: unknown) =>
    tap(() =>
      logger.error(
        `Error fetching best players page ${url}. Status: ${get(error, 'status', 'unknown')}. Retrying...`,
      ),
    );
  const delayTenMinutes = delay(TEN_MINUTES_MS);

  return getWebsite(url).pipe(
    map((soup) => soup.findAll('tr')),
    map((items) =>
      items
        .map((item) => item.getText('|'))
        .filter(Boolean)
        .map((text) => `${url}|${text}`),
    ),
    catchError((error) => {
      logError(error);

      return fetchBestPlayersPage(url).pipe(delayTenMinutes);
    }),
  );
}
