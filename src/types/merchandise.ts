export interface MerchandiseItem {
    id: string;
    name: string;
    description: string;
    price: string;
    timeFrame: string;
    fullDescription: string;
    colors: { name: string; image: string }[];
    sizes: string[];
}

export interface OrderPayload {
  merchandiseId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  color: string;
  size: string;
  quantity: number;
  totalAmount: number;
}