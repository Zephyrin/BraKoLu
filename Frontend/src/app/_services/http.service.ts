import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';

export abstract class HttpService<T> {

  constructor(protected http: HttpClient) { }

  abstract createPath(): string;
  abstract getAllPath(): string;
  abstract getPath(): string;
  abstract updatePath(): string;
  abstract deletePath(): string;

  create(elt: T): Observable<T> {
    return this.http.post<T>(
      `${environment.apiUrl}/${this.createPath()}`, elt);
  }

  getAll(httpParams: HttpParams): Observable<HttpResponse<T[]>> {
    return this.http.get<T[]>(`${environment.apiUrl}/${this.getAllPath()}`,
      { params: httpParams, observe: 'response' });
  }

  get(id: string): Observable<T> {
    return this.http.get<T>(
      `${environment.apiUrl}/${this.getPath()}/${id}`
    );
  }

  update(id: string, elt: T): Observable<T> {
    return this.http.patch<T>(
      `${environment.apiUrl}/${this.updatePath()}/${id}`, elt);
  }

  delete(id: string): Observable<{}> {
    return this.http.delete(
      `${environment.apiUrl}/${this.deletePath}/${id}`)
      .pipe(catchError(this.handleError));
  }



  handleError(error: any) {
    if (error instanceof String
      || typeof (error) === 'string') {
      console.error(error);
    } else if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }
}
