import { Test, TestingModule } from "@nestjs/testing";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ExecutionContext } from "@nestjs/common";

// Mock guard to simulate JWT and roles
class MockJwtAuthGuard {
  user: any;
  constructor(user: any) {
    this.user = user;
  }
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = this.user;
    return true;
  }
}

describe("TransactionsController", () => {
  let controller: TransactionsController;
  let service: TransactionsService;
  let prisma: PrismaService;

  const mockService = {
    deposit: jest.fn(),
    withdraw: jest.fn(),
    transfer: jest.fn(),
    getTransactionById: jest.fn(),
    getAllTransactions: jest.fn(),
  };
  const mockPrisma = {
    account: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: mockService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(new MockJwtAuthGuard({ id: 1, role: "admin" }))
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("deposit", () => {
    it("should allow admin to deposit", async () => {
      mockService.deposit.mockResolvedValue({ id: 1 });
      const result = await controller.deposit(
        { user: { id: 1, role: "admin" } },
        { accountId: 1, amount: 100 }
      );
      expect(result).toEqual({ id: 1 });
      expect(mockService.deposit).toHaveBeenCalled();
    });
    it("should allow user to deposit to own account", async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 2,
      });
      mockService.deposit.mockResolvedValue({ id: 2 });
      const ctrl = new TransactionsController(service, prisma);
      const req = { user: { id: 2, role: "user" } };
      await ctrl.deposit(req, { accountId: 1, amount: 50 });
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockService.deposit).toHaveBeenCalled();
    });
    it("should forbid user from depositing to another user account", async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 3,
      });
      const ctrl = new TransactionsController(service, prisma);
      const req = { user: { id: 2, role: "user" } };
      await expect(
        ctrl.deposit(req, { accountId: 1, amount: 50 })
      ).rejects.toThrow("Forbidden");
    });
  });

  describe("withdraw", () => {
    it("should allow admin to withdraw", async () => {
      mockService.withdraw.mockResolvedValue({ id: 1 });
      const result = await controller.withdraw(
        { user: { id: 1, role: "admin" } },
        { accountId: 1, amount: 100 }
      );
      expect(result).toEqual({ id: 1 });
      expect(mockService.withdraw).toHaveBeenCalled();
    });
    it("should allow user to withdraw from own account", async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 2,
      });
      mockService.withdraw.mockResolvedValue({ id: 2 });
      const ctrl = new TransactionsController(service, prisma);
      const req = { user: { id: 2, role: "user" } };
      await ctrl.withdraw(req, { accountId: 1, amount: 50 });
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockService.withdraw).toHaveBeenCalled();
    });
    it("should forbid user from withdrawing from another user account", async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 3,
      });
      const ctrl = new TransactionsController(service, prisma);
      const req = { user: { id: 2, role: "user" } };
      await expect(
        ctrl.withdraw(req, { accountId: 1, amount: 50 })
      ).rejects.toThrow("Forbidden");
    });
  });

  describe("transfer", () => {
    it("should allow admin to transfer", async () => {
      mockService.transfer.mockResolvedValue({
        from: { id: 1 },
        to: { id: 2 },
      });
      const result = await controller.transfer(
        { user: { id: 1, role: "admin" } },
        { fromAccountId: 1, toAccountId: 2, amount: 10 }
      );
      expect(result).toEqual({ from: { id: 1 }, to: { id: 2 } });
      expect(mockService.transfer).toHaveBeenCalled();
    });
    it("should allow user to transfer from own account", async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 2,
      });
      mockService.transfer.mockResolvedValue({
        from: { id: 1 },
        to: { id: 2 },
      });
      const ctrl = new TransactionsController(service, prisma);
      const req = { user: { id: 2, role: "user" } };
      await ctrl.transfer(req, {
        fromAccountId: 1,
        toAccountId: 2,
        amount: 10,
      });
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockService.transfer).toHaveBeenCalled();
    });
    it("should forbid user from transferring from another user account", async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 3,
      });
      const ctrl = new TransactionsController(service, prisma);
      const req = { user: { id: 2, role: "user" } };
      await expect(
        ctrl.transfer(req, { fromAccountId: 1, toAccountId: 2, amount: 10 })
      ).rejects.toThrow("Forbidden");
    });
  });

  describe("findOne", () => {
    it("should allow admin to get any transaction", async () => {
      mockService.getTransactionById.mockResolvedValue({ id: 1, userId: 2 });
      const result = await controller.findOne(
        { user: { id: 1, role: "admin" } },
        "1"
      );
      expect(result).toEqual({ id: 1, userId: 2 });
    });
    it("should allow user to get own transaction", async () => {
      mockService.getTransactionById.mockResolvedValue({ id: 1, userId: 2 });
      const ctrl = new TransactionsController(service, prisma);
      const req = { user: { id: 2, role: "user" } };
      const result = await ctrl.findOne(req, "1");
      expect(result).toEqual({ id: 1, userId: 2 });
    });
    it("should forbid user from getting another user transaction", async () => {
      mockService.getTransactionById.mockResolvedValue({ id: 1, userId: 3 });
      const ctrl = new TransactionsController(service, prisma);
      const req = { user: { id: 2, role: "user" } };
      await expect(ctrl.findOne(req, "1")).rejects.toThrow("Forbidden");
    });
  });

  describe("findAll", () => {
    it("should allow admin to get all transactions", async () => {
      mockService.getAllTransactions.mockResolvedValue([
        { id: 1, userId: 2 },
        { id: 2, userId: 3 },
      ]);
      const result = await controller.findAll({
        user: { id: 1, role: "admin" },
      });
      expect(result).toEqual([
        { id: 1, userId: 2 },
        { id: 2, userId: 3 },
      ]);
    });
    it("should allow user to get only own transactions", async () => {
      mockService.getAllTransactions.mockResolvedValue([
        { id: 1, userId: 2 },
        { id: 2, userId: 3 },
      ]);
      const ctrl = new TransactionsController(service, prisma);
      const req = { user: { id: 2, role: "user" } };
      const result = await ctrl.findAll(req);
      expect(result).toEqual([{ id: 1, userId: 2 }]);
    });
  });
});
