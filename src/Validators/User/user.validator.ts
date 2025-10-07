import * as z from "zod";
import { GenderEnum } from "../../Common";

export const SignUpSchemaValidator = z.object({
  firstName: z
    .string()
    .min(3, "First Name Must Be At Least 3 Characters Long")
    .max(20, "First Name Must Be At Most 20 Characters Long"),
  lastName: z
    .string()
    .min(3, "Last Name Must Be At Least 3 Characters Long")
    .max(20, "Last Name Must Be At Most 20 Characters Long"),
  email: z.string().email("Invalid Email"),
  phone: z
    .string()
    .min(11, "Phone Number Must Be At Least 11 Characters Long")
    .max(11, "Phone Number Must Be At Most 11 Characters Long"),
  password: z
    .string()
    .min(8, "Password Must Be At Least 8 Characters Long")
    .max(20, "Password Must Be At Most 20 Characters Long"),
  gender: z.enum(GenderEnum),
  age: z
    .number()
    .min(18, "Age Must Be At Least 18 Years Old")
    .max(120, "Age Must Be At Most 120 Years Old"),
});
