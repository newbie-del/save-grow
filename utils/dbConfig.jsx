import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://save-and-grow:npg_EMCSbhxH4X8I@ep-soft-band-a5tres0r.us-east-2.aws.neon.tech/save-and-grow?sslmode=require"
);
export const db = drizzle(sql, { schema });
