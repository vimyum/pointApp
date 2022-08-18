export interface UserDbInfo {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "user";
  balance: number;
}