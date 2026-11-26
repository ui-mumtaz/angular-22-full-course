export interface Review {
  rating: number;
  comment: string;
  reviewerName: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  brand?: string;                 // some dummyjson products have no brand
  sku: string;
  weight: number;
  warrantyInformation: string;
  shippingInformation: string;
  reviews: Review[];
}
