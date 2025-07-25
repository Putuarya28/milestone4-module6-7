import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        { provide: AccountsService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get<AccountsService>(AccountsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an account', async () => {
      mockService.create.mockResolvedValue({ id: 1, userId: '1', balance: 100 });
      const req = { user: { id: 1, role: 'user' } } as any;
      const result = await controller.create(req, { userId: '1', balance: 100 });
      expect(result).toEqual({ id: 1, userId: '1', balance: 100 });
    });
    it('should throw Forbidden on invalid input', async () => {
      mockService.create.mockImplementation(() => { throw new Error('Forbidden'); });
      const req = { user: { id: 1 } } as any;
      await expect(controller.create(req, {} as any)).rejects.toThrow('Forbidden');
    });
  });

  describe('findAll', () => {
    it('should return all accounts for user (may be empty)', async () => {
      mockService.findAll.mockResolvedValue([]);
      const req = { user: { id: 1, role: 'user' } } as any;
      const result = await controller.findAll(req);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should throw Forbidden if not allowed', async () => {
      mockService.findOne.mockImplementation(() => { throw new Error('Forbidden'); });
      const req = { user: { id: 1, role: 'user' } } as any;
      await expect(controller.findOne(req, '1')).rejects.toThrow('Forbidden');
    });
    it('should throw Unauthorized if not authorized', async () => {
      mockService.findOne.mockImplementation(() => { throw new Error('Unauthorized'); });
      const req = { user: { id: 1 } } as any;
      await expect(controller.findOne(req, '1')).rejects.toThrow('Unauthorized');
    });
  });

  describe('update', () => {
    it('should throw Unauthorized if not allowed to update', async () => {
      mockService.update.mockImplementation(() => { throw new Error('Unauthorized'); });
      const req = { user: { id: 1, role: 'user' } } as any;
      await expect(controller.update(req, '1', { balance: 200 })).rejects.toThrow('Unauthorized');
    });
    it('should throw Unauthorized on invalid update', async () => {
      mockService.update.mockImplementation(() => { throw new Error('Unauthorized'); });
      const req = { user: { id: 1 } } as any;
      await expect(controller.update(req, '1', {} as any)).rejects.toThrow('Unauthorized');
    });
  });

  describe('remove', () => {
    it('should throw Unauthorized if not allowed to delete', async () => {
      mockService.remove.mockImplementation(() => { throw new Error('Unauthorized'); });
      const req = { user: { id: 1, role: 'user' } } as any;
      await expect(controller.remove(req, '1')).rejects.toThrow('Unauthorized');
    });
    it('should throw Unauthorized if not authorized', async () => {
      mockService.remove.mockImplementation(() => { throw new Error('Unauthorized'); });
      const req = { user: { id: 1 } } as any;
      await expect(controller.remove(req, '1')).rejects.toThrow('Unauthorized');
    });
  });
});
