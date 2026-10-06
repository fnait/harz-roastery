import "dotenv/config";

import type { CourseEnrollment } from "./courseEnrollment.service";
import type { CustomRoastingRequest } from "./customRoasting.service";
import type { Order } from "./order.service";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type TelegramSendMessageResponse = {
  ok: boolean;
  description?: string;
};

type OrderNotificationData = Pick<Order, "id" | "customer" | "items" | "total">;

type CourseEnrollmentNotificationData = Pick<
  CourseEnrollment,
  "id" | "course" | "customer"
>;

type CustomRoastingNotificationData = Pick<
  CustomRoastingRequest,
  "id" | "customer" | "coffee" | "message"
>;

// ----------------------------------------------------------------------
// CONFIG
// ----------------------------------------------------------------------

function getTelegramConfig() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  }

  if (!chatId) {
    throw new Error("TELEGRAM_CHAT_ID is not configured.");
  }

  return { botToken, chatId };
}

// ----------------------------------------------------------------------
// SEND MESSAGE
// ----------------------------------------------------------------------

export async function sendTelegramMessage(text: string): Promise<void> {
  const { botToken, chatId } = getTelegramConfig();

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    },
  );

  const data = (await response.json()) as TelegramSendMessageResponse;

  if (!response.ok || !data.ok) {
    throw new Error(
      data.description ??
        `Telegram API request failed with status ${response.status}.`,
    );
  }
}

// ----------------------------------------------------------------------
// ORDER NOTIFICATIONS
// ----------------------------------------------------------------------

export async function sendOrderNotification(
  order: OrderNotificationData,
): Promise<void> {
  const itemsText = order.items
    .map((item) => {
      const itemTotal = item.price * item.quantity;

      return [
        `• ${item.name} × ${item.quantity}`,
        `  ${item.roast} · ${item.weight}`,
        `  ₴${itemTotal}`,
      ].join("\n");
    })
    .join("\n\n");

  const comment = order.customer.comment.trim();

  const message = [
    "🛒 НОВЕ ЗАМОВЛЕННЯ",
    "",
    `Замовлення: #${order.id}`,
    "",
    "Клієнт:",
    `Ім'я: ${order.customer.name}`,
    `Телефон: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    "",
    "Доставка:",
    `Місто: ${order.customer.city}`,
    `Адреса: ${order.customer.address}`,
    "",
    "Товари:",
    itemsText,
    "",
    `💰 Разом: ₴${order.total}`,
    ...(comment ? ["", "Коментар:", comment] : []),
  ].join("\n");

  await sendTelegramMessage(message);
}

// ----------------------------------------------------------------------
// COURSE ENROLLMENT NOTIFICATIONS
// ----------------------------------------------------------------------

export async function sendCourseEnrollmentNotification(
  enrollment: CourseEnrollmentNotificationData,
): Promise<void> {
  const message = [
    "🎓 НОВА ЗАПИС НА КУРС",
    "",
    `Заявка: #${enrollment.id}`,
    "",
    "Курс:",
    `${enrollment.course.title}`,
    `Тривалість: ${enrollment.course.duration}`,
    `Ціна: ₴${enrollment.course.price}`,
    "",
    "Клієнт:",
    `Ім'я: ${enrollment.customer.name}`,
    `Телефон: ${enrollment.customer.phone}`,
    `Email: ${enrollment.customer.email}`,
  ].join("\n");

  await sendTelegramMessage(message);
}

// ----------------------------------------------------------------------
// CUSTOM ROASTING NOTIFICATIONS
// ----------------------------------------------------------------------

export async function sendCustomRoastingNotification(
  request: CustomRoastingNotificationData,
): Promise<void> {
  const extraMessage = request.message.trim();

  const message = [
    "🔥 НОВА ЗАЯВКА НА ОБСМАЖУВАННЯ",
    "",
    `Заявка: #${request.id}`,
    "",
    "Клієнт:",
    `Ім'я: ${request.customer.name}`,
    `Телефон: ${request.customer.phone}`,
    `Email: ${request.customer.email}`,
    "",
    "Параметри:",
    `Походження: ${request.coffee.origin}`,
    `Кількість: ${request.coffee.quantity}`,
    `Обсмажування: ${request.coffee.roast}`,
    `Призначення: ${request.coffee.purpose}`,
    ...(extraMessage ? ["", "Коментар:", extraMessage] : []),
  ].join("\n");

  await sendTelegramMessage(message);
}
