import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AccountsModule } from "./accounts/accounts.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { PrismaService } from "./prisma/prisma.service";
import { HealthController } from "./health.controller";

@Module({
  imports: [AuthModule, UsersModule, AccountsModule, TransactionsModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}
