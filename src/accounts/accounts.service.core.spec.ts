import { AccountsService } from "./accounts.service";
import { PrismaService } from "../prisma/prisma.service";

describe("AccountsService (core logic)", () => {
  let service: AccountsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      account: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new AccountsService(prisma as unknown as PrismaService);
  });

  it("should create an account with initial balance", async () => {
    prisma.account.create.mockResolvedValue({ id: 1, userId: 1, balance: 100 });
    const result = await service.createAccount(1, 100);
    expect(result).toEqual({ id: 1, userId: 1, balance: 100 });
    expect(prisma.account.create).toHaveBeenCalledWith({
      data: { userId: 1, balance: 100 },
    });
  });

  it("should get account by id", async () => {
    prisma.account.findUnique.mockResolvedValue({
      id: 1,
      userId: 1,
      balance: 100,
    });
    const result = await service.getAccountById(1);
    expect(result).toEqual({ id: 1, userId: 1, balance: 100 });
    expect(prisma.account.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should update account balance", async () => {
    prisma.account.update.mockResolvedValue({ id: 1, userId: 1, balance: 200 });
    const result = await service.updateAccount(1, 200);
    expect(result).toEqual({ id: 1, userId: 1, balance: 200 });
    expect(prisma.account.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { balance: 200 },
    });
  });

  it("should delete account", async () => {
    prisma.account.delete.mockResolvedValue({ id: 1, userId: 1, balance: 0 });
    const result = await service.deleteAccount(1);
    expect(result).toEqual({ id: 1, userId: 1, balance: 0 });
    expect(prisma.account.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
