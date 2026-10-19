import { z } from "zod";

export const garbageTypesEnum = z.enum([
  "plastic",
  "household",
  "debris",
  "medical",
  "e-waste",
  "dead_animal",
  "drain_block",
]);

export const reportSeverityEnum = z.enum(["small", "medium", "large"]);

export const reportStatusEnum = z.enum(["reported", "in_progress", "cleaned"]);

export const reportSchema = z.object({
  lat: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  lng: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  address: z.string().min(3, "Address must be at least 3 characters"),
  cityId: z.string().min(1, "City is required"),
  cityName: z.string().min(1, "City name is required"),
  wardId: z.string().optional(),
  wardName: z.string().optional(),
  types: z.array(garbageTypesEnum).min(1, "Select at least one garbage type"),
  severity: reportSeverityEnum,
  description: z.string().max(1000, "Description must be under 1000 characters"),
  anonymous: z.boolean().default(false),
  mediaUrls: z.array(z.string()).default([]),
  mediaType: z.enum(["image", "video"]).default("image"),
});

export const phoneAuthSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, "Please enter a valid phone number with country code"),
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only digits"),
});

export const emailAuthSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startAt: z.string().datetime({ message: "Invalid ISO date string" }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  capacity: z.number().min(5, "Capacity must be at least 5").max(500, "Capacity cannot exceed 500"),
  bring: z.array(z.string()).default([]),
  provided: z.array(z.string()).default([]),
});

export const organizationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cityId: z.string().min(1, "City is required"),
  logo: z.string().max(4).optional(),
});
