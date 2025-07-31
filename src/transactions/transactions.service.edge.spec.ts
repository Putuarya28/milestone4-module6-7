import { TransactionsService } from "./transactions.service";
import { PrismaService } from "../prisma/prisma.service";

describe("TransactionsService (edge cases)", () => {
  let service: TransactionsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      account: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      transaction: {
        create: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(prisma)),
    };
    service = new TransactionsService(prisma as unknown as PrismaService);
  });

  it("should throw if deposit amount is not positive", async () => {
    await expect(service.deposit({ accountId: 1, amount: 0 })).rejects.toThrow(
      "Deposit amount must be positive"
    );
    await expect(
      service.deposit({ accountId: 1, amount: -10 })
    ).rejects.toThrow("Deposit amount must be positive");
  });

  it("should throw if withdraw amount is not positive", async () => {
    await expect(service.withdraw({ accountId: 1, amount: 0 })).rejects.toThrow(
      "Withdraw amount must be positive"
    );
    await expect(
      service.withdraw({ accountId: 1, amount: -10 })
    ).rejects.toThrow("Withdraw amount must be positive");
  });

  it("should throw if withdraw with insufficient balance", async () => {
    prisma.account.findUnique.mockResolvedValue({
      id: 1,
      balance: 50,
      userId: 1,
    });
    await expect(
      service.withdraw({ accountId: 1, amount: 100 })
    ).rejects.toThrow("Insufficient balance");
  });

  it("should throw if transfer amount is not positive", async () => {
    await expect(
      service.transfer({ fromAccountId: 1, toAccountId: 2, amount: 0 })
    ).rejects.toThrow("Transfer amount must be positive");
    await expect(
      service.transfer({ fromAccountId: 1, toAccountId: 2, amount: -10 })
    ).rejects.toThrow("Transfer amount must be positive");
  });

  it("should throw if transfer to same account", async () => {
    await expect(
      service.transfer({ fromAccountId: 1, toAccountId: 1, amount: 10 })
    ).rejects.toThrow("Cannot transfer to the same account");
  });

  it("should throw if transfer with insufficient balance", async () => {
    prisma.account.findUnique.mockImplementation(({ where: { id } }: any) => {
      if (id === 1) return Promise.resolve({ id: 1, balance: 50, userId: 1 });
      if (id === 2) return Promise.resolve({ id: 2, balance: 100, userId: 2 });
    });
    await expect(
      service.transfer({ fromAccountId: 1, toAccountId: 2, amount: 100 })
    ).rejects.toThrow("Insufficient balance in source account");
  });
});
