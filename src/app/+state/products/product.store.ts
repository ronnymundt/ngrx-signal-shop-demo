import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withComputed,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { ProductService } from '../../services';
import { IProductState } from './product.model';

const initialProductState: IProductState = {
  products: [],
  search: null,
  isOrderAsc: true,
  page: 1,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(() => initialProductState),
  // selectors
  withComputed((store) => ({
    selectProducts: computed(() => store.products()),
    selectSearch: computed(() => store.search()),
    selectOrder: computed(() => store.isOrderAsc()),
    selectPage: computed(() => store.page()),
    selectProductsViewModel: computed(() => {
      const chunkSize = 10;
      const search = store.search();
      const products = store.products();
      const isOrderAsc = store.isOrderAsc();
      const page = store.page();
      // filter
      const f = products.filter((f) =>
        f.title.toLowerCase().includes(search?.toLowerCase() ?? ''),
      );
      // sort
      const o = f.sort(
        (a, b) => (a.title < b.title ? 1 : -1) * (isOrderAsc ? -1 : 1),
      );
      // pagination
      const paginator = Array.from(
        { length: Math.ceil(o.length / chunkSize) },
        (_, i) => i + 1,
      );
      const start = (page - 1) * chunkSize;
      const paged = o.slice(start, start + chunkSize);

      return {
        products: paged,
        currentPage: page,
        paginator,
        isNextDisabled: page >= paginator.length,
        isPrevDisabled: page <= 1,
      };
    }),
  })),
  // actions
  withMethods((store, productService = inject(ProductService)) => ({
    fetchProducts: rxMethod<void>(
      pipe(
        switchMap(() =>
          productService
            .getProducts()
            .pipe(tap((products) => patchState(store, { products }))),
        ),
      ),
    ),
    setSearch: (search: string) => patchState(store, { search }),
    toggleOrderDir: () =>
      patchState(store, { isOrderAsc: !store.isOrderAsc() }),
    setPaging: (paging: number) => patchState(store, { page: paging }),
    nextPage: () => {
      const p = store.page();
      patchState(store, { page: p + 1 });
    },
    prevPage: () => {
      const p = store.page();
      patchState(store, { page: p - 1 });
    },
  })),
);
