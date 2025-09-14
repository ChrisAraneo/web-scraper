import { logger } from './utils/logger';
import { getWebsite } from './get-website';
import { catchError, delay, EMPTY, map, Observable } from 'rxjs';
import { shouldRetry } from './utils/should-retry';
import { get } from 'lodash';

const TEN_MINUTES_MS = 1000 * 60 * 10;

export function fetchDetailsPage(url: string): Observable<string[]> {
  const logError = (error: unknown) =>
    logger.error(
      `Error fetching details page ${url}. Status: ${get(error, 'status', 'unknown')}`,
    );
  const logErrorRetry = (error: unknown) =>
    logger.error(
      `Error fetching list page ${url}. Status: ${get(error, 'status', 'unknown')}. Retrying...`,
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
    catchError((error: unknown) => {
      if (shouldRetry(error)) {
        logErrorRetry(error);

        return fetchDetailsPage(url).pipe(delayTenMinutes);
      } else {
        logError(error);

        return EMPTY;
      }
    }),
  );
}
