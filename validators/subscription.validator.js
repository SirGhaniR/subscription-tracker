import { z } from "zod";
import dayjs from "dayjs";

export const createSubscription = z
  .object({
    name: z.string().trim().min(2).max(100),
    price: z.number().min(0),
    currency: z.enum(["IDR", "USD", "EUR"]).optional(),
    frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
    category: z.enum([
      "sports",
      "news",
      "finance",
      "entertainment",
      "lifestyle",
      "technology",
      "politics",
      "other",
    ]),
    paymentMethod: z.string().trim().min(1),
    startDate: z.coerce.date(),
    renewalDate: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      dayjs(data.startDate).isBefore(dayjs()) ||
      dayjs(data.startDate).isSame(dayjs(), "day"),
    {
      message: "Start date must be in the past",
      path: ["startDate"],
    },
  )
  .refine(
    (data) =>
      !data.renewalDate ||
      dayjs(data.renewalDate).isAfter(dayjs(data.startDate)),
    {
      message: "Renewal date must be after start date",
      path: ["renewalDate"],
    },
  );
