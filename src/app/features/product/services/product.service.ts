import { inject, Injectable } from '@angular/core';
import { DEFAULT_LIMIT_SIZE, INITIAL_PAGE } from '../product.constant';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductResponse } from '../product.interface';
import { environment } from '../../../../environments/environment';
import { catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _http = inject(HttpClient);

  getProducts$(params: { [key: string]: string }) {
    return this._http.get<ProductResponse>(
      `${environment.apiUrl}/products`,
      { params: this.getQueryParams(params) }
    ).pipe(
      map(response => response.products),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  getQueryParams(params: { [key: string]: string }): HttpParams {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    return httpParams;
  }

}
