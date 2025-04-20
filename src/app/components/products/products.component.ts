import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../+state/cart';
import { ProductStore } from '../../+state/products';
import { IProduct } from '../../interfaces';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  txbSearch = new FormControl();
  productStore = inject(ProductStore);
  cartStore = inject(CartStore);
  selectProducts = this.productStore.selectProductsViewModel;
  selectCartCount = this.cartStore.selectCount;

  /**
   * On add to cart click
   * @param p
   */
  onAddToCartClick(p: IProduct) {
    this.cartStore.addProduct({
      id: p.id,
      price: p.price,
      title: p.title,
      amount: 1,
    });
  }

  /**
   * On search click
   */
  onSearchClick() {
    const s = this.txbSearch.value.toLowerCase();
    this.productStore.setSearch(s);
    this.onPagingClick(1);
  }

  /**
   * On toggle order click
   */
  onToggleOrderClick() {
    this.productStore.toggleOrderDir();
  }

  /**
   * On paging click
   * @param p
   */
  onPagingClick(p: number) {
    this.productStore.setPaging(p);
  }

  /**
   * On paging prev/next click
   * @param p
   */
  onPagingPrevNextClick(p: 'prev' | 'next') {
    p === 'next' ? this.productStore.nextPage() : this.productStore.prevPage();
  }
}
