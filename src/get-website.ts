import JSSoup from 'jssoup';
import axios from 'axios';
import { from, Observable } from 'rxjs';

export function getWebsite(url: string): Observable<any> {
  return from(
    axios.get(encodeURI(url)).then((response) => new JSSoup(response.data)),
  );
}
