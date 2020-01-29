import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ApiException, isError} from './dtos/api-exception';

@Injectable()
export class PageErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  handleError<T>(response: T | ApiException, f: (T) => void) {
    if (isError(response)) {
      console.error(JSON.stringify(response));
      this.snackBar.open('Impossibile reperire le informazioni, per favore controlla la tua connessione!', 'Chiudi', {
        duration: 4000
      });

      return;
    }

    f(response as T);
  }
}
