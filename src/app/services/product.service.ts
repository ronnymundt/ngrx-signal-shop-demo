import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IProduct, IProductsRequest } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpClient = inject(HttpClient);
  private api =
    'https://dummyjson.com/products?limit=57&select=title,price,description,thumbnail';

  /**
   * Service gets products from dummyjson API
   */
  getProducts(): Observable<IProduct[]> {
    return this.httpClient
      .get<IProductsRequest>(this.api)
      .pipe(map(({ products }) => products));
  }
}
