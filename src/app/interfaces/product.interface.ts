export interface IProductsRequest {
  products: IProduct[];
}

export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}
