import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import {
  entityConfig,
  upsertEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { removeEntity } from '@ngrx/signals/entities';
import { ICart } from '../../interfaces';
import { ICartState } from './cart.model';

const cartConfig = entityConfig({
  entity: type<ICartState>(),
  collection: 'cart',
  selectId: (p) => p.id,
});

export const CartStore = signalStore(
  { providedIn: 'root' },
  withEntities(cartConfig),
  // selectors
  withComputed((store) => ({
    selectCount: computed(() =>
      store.cartEntities().reduce((acc, cur) => acc + cur.amount, 0),
    ),
    selectViewModel: computed(() => {
      const cart = store.cartEntities().map((m) => ({
        ...m,
        total: m.price * m.amount,
      }));
      const totalPrice = cart.reduce(
        (acc, cur) => acc + cur.price * cur.amount,
        0,
      );
      const totalAmount = cart.reduce((acc, cur) => acc + cur.amount, 0);
      return {
        cart,
        totalPrice,
        totalAmount,
      };
    }),
  })),
  // actions
  withMethods((store) => ({
    removeProduct(id: number) {
      patchState(store, removeEntity(id, cartConfig));
    },
    addProduct(cart: ICart) {
      const finding = store.cartEntities().find((f) => f.id === cart.id);
      patchState(
        store,
        upsertEntity(
          {
            ...cart,
            amount: finding ? ++finding.amount : cart.amount,
          },
          cartConfig,
        ),
      );
    },
  })),
);
