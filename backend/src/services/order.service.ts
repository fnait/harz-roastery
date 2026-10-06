import { firestore } from "../config/firebase";

import type { Product } from "./product.service";

export type OrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type OrderCustomer = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  comment: string;
};

export type OrderItem = {
  id: number;
  name: string;
  roast: string;
  weight: string;
  price: number;
  image: string;
  quantity: number;
};

export type Order = {
  id: number;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
};

export type CreateOrderItem = {
  productId: number;
  quantity: number;
};

export type CreateOrderInput = {
  customer: OrderCustomer;
  items: CreateOrderItem[];
};

const ORDERS_COLLECTION = "harz_orders";
const PRODUCTS_COLLECTION = "harz_products";

const getOrdersCollection = () => firestore.collection(ORDERS_COLLECTION);

function createOrderId(): number {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

// ----------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------

export async function getOrders(): Promise<Order[]> {
  const snapshot = await getOrdersCollection().get();

  return snapshot.docs
    .map((document) => document.data() as Order)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const productIds = [...new Set(input.items.map((item) => item.productId))];

  const productRefs = productIds.map((id) =>
    firestore.collection(PRODUCTS_COLLECTION).doc(String(id)),
  );

  const productSnapshots = await firestore.getAll(...productRefs);

  const productMap = new Map<number, Product>();

  for (const snapshot of productSnapshots) {
    if (!snapshot.exists) {
      continue;
    }

    const product = snapshot.data() as Product;

    productMap.set(product.id, product);
  }

  const orderItems: OrderItem[] = input.items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error(`Product with id ${item.productId} was not found.`);
    }

    if (!product.inStock) {
      throw new Error(`${product.name} is out of stock.`);
    }

    return {
      id: product.id,
      name: product.name,
      roast: product.roast,
      weight: product.weight,
      price: product.price,
      image: product.image,
      quantity: item.quantity,
    };
  });

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const id = createOrderId();

  const order: Order = {
    id,
    createdAt: new Date().toISOString(),
    customer: input.customer,
    items: orderItems,
    total,
    status: "new",
  };

  await getOrdersCollection().doc(String(id)).set(order);

  return order;
}

// ----------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------

export async function updateOrderStatus(
  id: number,
  status: OrderStatus,
): Promise<Order> {
  const document = getOrdersCollection().doc(String(id));
  const snapshot = await document.get();

  if (!snapshot.exists) {
    throw new Error(`Order with id ${id} was not found.`);
  }

  const order = snapshot.data() as Order;

  const updatedOrder: Order = { ...order, status };

  await document.set(updatedOrder, { merge: false });

  return updatedOrder;
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function deleteOrder(id: number): Promise<void> {
  const document = getOrdersCollection().doc(String(id));
  const snapshot = await document.get();

  if (!snapshot.exists) {
    throw new Error(`Order with id ${id} was not found.`);
  }

  await document.delete();
}
