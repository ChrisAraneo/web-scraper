import { logger } from './logger';
import { getWebsite } from './get-website';
import {
  catchError,
  delay,
  EMPTY,
  finalize,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { runWhenElse } from './run-when-else';
import { shouldRetry } from './should-retry';

const TEN_MINUTES_MS = 1000 * 60 * 10;

export function fetchDetailsPage(url: string): Observable<string[]> {
  return getWebsite(url).pipe(
    map((soup) => soup.findAll('tr')),
    map((items) =>
      items
        .map((item) => item.getText('|'))
        .filter(Boolean)
        .map((text) => `${url}|${text}`),
    ),
    catchError((error) =>
      runWhenElse(
        shouldRetry(error),
        () =>
          fetchDetailsPage(url).pipe(
            tap(() =>
              logger.error(
                `Error fetching details page ${url}. Status: ${error?.status}. Retrying...`,
              ),
            ),
            delay(TEN_MINUTES_MS),
          ),
        () =>
          of([]).pipe(
            finalize(() =>
              logger.error(
                `Error fetching details page ${url}. Status: ${error?.status}`,
              ),
            ),
          ),
      ),
    ),
  );
}
