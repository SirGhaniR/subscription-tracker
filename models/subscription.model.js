import dayjs from "dayjs";
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required!"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required!"],
      min: [0, "Price must be greater than 0"],
    },
    currency: {
      type: String,
      enum: ["IDR", "USD", "EUR"],
      default: "IDR",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "finance",
        "entertainment",
        "lifestyle",
        "technology",
        "politics",
        "other",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

subscriptionSchema.pre("validate", function () {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = dayjs(this.startDate)
      .add(renewalPeriods[this.frequency], "day")
      .toDate();
  }

  if (dayjs(this.renewalDate).isBefore(dayjs())) {
    this.status = "expired";
  }
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
