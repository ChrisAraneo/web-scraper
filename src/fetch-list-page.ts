import { logger } from './logger';
import { getWebsite } from './get-website';
import { catchError, delay, map, Observable, tap } from 'rxjs';
import { get } from 'lodash';

const TEN_MINUTES_MS = 1000 * 60 * 10;

export function fetchListPage(url: string): Observable<string[]> {
  const logError = (error: unknown) => tap(() => logger.error(
    `Error fetching list page ${url}. Status: ${get(error, 'status', 'unknown')}. Retrying...`,
  ));
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

      return fetchListPage(url).pipe(delayTenMinutes);
    }));
}
