export interface UserDbInfo {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "user";
  balance: number;
}

export interface History {
  name: string;
  date: number;
};

export type Histories = Record<string, History>;

export interface Ticket {
  ticketId: string;
  amount: number;
  comment: string;
  history: Histories;
  picture: string;
};


