import { isNaN, get, isInteger, isString, isNumber } from 'lodash';

export function shouldRetry(data?: { status?: number } | unknown): boolean {
  const status = get(data, 'status');

  if (!isString(status) && !isNumber(status)) {
    return true;
  }

  const numberStatus = Number(status);

  return (
    !isInteger(numberStatus) ||
    isNaN(numberStatus) ||
    numberStatus === 429 ||
    (numberStatus >= 500 && numberStatus <= 599)
  );
}
