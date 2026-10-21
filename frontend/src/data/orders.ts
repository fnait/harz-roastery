export type OrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

// Product snapshot saved in an order (matches the backend order item).
export type OrderItem = {
  id: number;
  name: string;
  roast: string;
  weight: string;
  price: number;
  image: string;
  quantity: number;
};

// Shopping cart item: an order item plus the current product stock,
// used only to limit the quantity in the cart.
export type CartItem = OrderItem & { stock: number };

export type OrderCustomer = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  comment: string;
};

export type Order = {
  id: number;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
};
