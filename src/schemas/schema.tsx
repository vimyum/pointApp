export interface UserInfo {
  id: string;
  displayName: string;
  role: "admin" | "user";
  point: number;
}