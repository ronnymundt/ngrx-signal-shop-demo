import { IProduct } from '../../interfaces';

export interface IProductState {
  products: IProduct[];
  search: string | null;
  isOrderAsc: boolean;
  page: number;
}
