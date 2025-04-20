import { Component, inject } from '@angular/core';
import {RouterLink} from '@angular/router';
import { CartStore } from '../../+state/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartStore = inject(CartStore);
  selectCartViewModel = this.cartStore.selectViewModel;

  /**
   * On remove product click
   * @param id
   */
  onRemoveProductClick(id: number) {
    this.cartStore.removeProduct(id);
  }
}
