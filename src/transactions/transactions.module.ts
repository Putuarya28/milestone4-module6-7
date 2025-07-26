import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { PrismaService } from "../prisma/prisma.service";
import { AuthModule } from "../auth/auth.module";

// ...existing code...
@Module({
  imports: [AuthModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService],
})
export class TransactionsModule {}
