import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

import courseRouter from "./routes/course.routes";
import courseEnrollmentRouter from "./routes/courseEnrollment.routes";
import customRoastingRouter from "./routes/customRoasting.routes";
import orderRouter from "./routes/order.routes";
import productRouter from "./routes/product.routes";
import translationRouter from "./routes/translation.routes";
import uploadRouter from "./routes/upload.routes";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "https://zharovnya-roastery.web.app",
  "https://zharovnya-roastery.firebaseapp.com",
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_request: Request, response: Response) => {
  response.json({ status: "ok" });
});

app.use("/api/translate", translationRouter);
app.use("/api/courses", courseRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/course-enrollments", courseEnrollmentRouter);
app.use("/api/custom-roasting", customRoastingRouter);

app.listen(PORT, () => {
  console.log(`HARZ backend running on http://localhost:${PORT}`);
});
