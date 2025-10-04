import JSSoup from 'jssoup';
import axios from 'axios';
import { from, Observable } from 'rxjs';
import { logger } from './utils/logger';

export function getWebsite(url: string): Observable<any> {
  return from(
    axios
      .get(encodeURI(url))
      .then((response) => {
        logger.debug(`Fetched website ${url}`, response?.status);

        return new JSSoup(response.data);
      })
      .catch((error) => {
        logger.debug(`Error fetching website ${url}`, error?.status);

        throw error;
      }),
  );
}
