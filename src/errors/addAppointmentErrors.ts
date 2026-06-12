import { DatabaseError } from "./databaseError";

export type AddAppointmentError =
  | "slot_taken"
  | DatabaseError;