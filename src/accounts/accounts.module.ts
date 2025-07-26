import { Module } from "@nestjs/common";
import { AccountsController } from "./accounts.controller";
import { AccountsService } from "./accounts.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
