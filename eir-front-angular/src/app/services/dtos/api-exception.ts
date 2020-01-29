import {isNull} from '../../helpers';

export interface ApiException {
  apiErrorCode: string;
  details: string;
  stack: string;
}

export const SESSION_NOT_FOUND_CODE = 'SES001';

export function isError<T>(response: T | ApiException) {
  const parsedResponse: ApiException = response as ApiException;
  return !isNull(parsedResponse) && !isNull(parsedResponse.apiErrorCode);
}
