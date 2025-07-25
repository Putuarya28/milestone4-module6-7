"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AccountsService = class AccountsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // Controller-facing methods
    async create(createAccountDto) {
        return this.createAccount(createAccountDto.userId, createAccountDto.balance);
    }
    async findOne(id) {
        return this.getAccountById(Number(id));
    }
    async findAll() {
        // This implementation assumes you want all accounts, not just by userId
        return this.prisma.account.findMany();
    }
    async update(id, updateAccountDto) {
        // Only balance is updatable in this DTO
        return this.updateAccount(Number(id), updateAccountDto.balance);
    }
    async remove(id) {
        return this.deleteAccount(Number(id));
    }
    async createAccount(userId, initialBalance) {
        return this.prisma.account.create({
            data: {
                userId,
                balance: initialBalance,
            },
        });
    }
    async getAccountById(accountId) {
        return this.prisma.account.findUnique({
            where: { id: accountId },
        });
    }
    async updateAccount(accountId, balance) {
        return this.prisma.account.update({
            where: { id: accountId },
            data: { balance },
        });
    }
    async deleteAccount(accountId) {
        return this.prisma.account.delete({
            where: { id: accountId },
        });
    }
    async getAllAccountsByUserId(userId) {
        return this.prisma.account.findMany({
            where: { userId },
        });
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountsService);
