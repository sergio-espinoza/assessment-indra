import { inject, Injectable } from '@angular/core';
import { DEFAULT_LIMIT_SIZE, INITIAL_PAGE } from '../product.constant';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product, ProductResponse } from '../product.interface';
import { environment } from '../../../../environments/environment';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _http = inject(HttpClient);

  private updatedProducts: Record<any, Product> = {};
  private removedProducts: string[] = [];

  getUpdatedProducts() {
    return this.updatedProducts;
  }

  getRemovedProducts() {
    return this.removedProducts;
  }

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

  getProductById$(id: string) {
    return this._http.get<Product>(
      `${environment.apiUrl}/products/${id}`
    ).pipe(
      map(response => ({ ...response, ...(this.getUpdatedProducts()[id] || {}) })),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  searchProducts$(params: { [key: string]: string }) {
    return this._http.get<ProductResponse>(
      `${environment.apiUrl}/products/search`,
      { params: this.getQueryParams(params) }
    ).pipe(
      map(response => response.products),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  updateProduct$(id: string, body: Partial<Product>) {
    return this._http.put<any>(`${environment.apiUrl}/products/${id}`, body)
      .pipe(
        tap((response) => this.updatedProducts[id] = response),
        catchError(error => {
          console.error(error);
          return of(null);
        })
      );
  }

  removeProduct$(id: string) {
    return this._http.delete<any>(`${environment.apiUrl}/products/${id}`)
      .pipe(
        tap(() => this.removedProducts.push(id)),
        catchError(error => {
          console.error(error);
          return of(null);
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
