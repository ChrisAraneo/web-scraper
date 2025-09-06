import { logger } from './logger';
import { getWebsite } from './get-website';
import { catchError, delay, map, Observable, tap } from 'rxjs';

const TEN_MINUTES_MS = 1000 * 60 * 10;

export function fetchListPage(url: string): Observable<string[]> {
  return getWebsite(url).pipe(
    map((soup) =>
      soup
        .findAll('tr')
        .map((tr) => tr.attrs?.id)
        .filter(Boolean),
    ),
    catchError(() =>
      fetchListPage(url).pipe(
        tap(() => logger.error(`Error fetching list page ${url}. Retrying...`)),
        delay(TEN_MINUTES_MS),
      ),
    ),
  );
}
