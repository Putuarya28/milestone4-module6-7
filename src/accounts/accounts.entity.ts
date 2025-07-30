import { User } from "../users/users.entity";
import { Transaction } from "../transactions/transactions.entity";

export class Account {
  id!: number;
  userId!: number;
  balance!: number;

  // Relationships
  user!: User;
  transactions!: Transaction[];
}
