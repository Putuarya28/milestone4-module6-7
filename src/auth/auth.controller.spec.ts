import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let service: AuthService;

  const mockService = {
    register: jest.fn(),
    login: jest.fn(({ email, password }) => {
      if (email === "test@example.com" && password === "pass") {
        return Promise.resolve({ access_token: "jwt" });
      } else {
        throw { status: 401, message: "Unauthorized" };
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a user", async () => {
      mockService.register.mockResolvedValue({
        id: 1,
        email: "test@example.com",
      });
      const result = await controller.register({
        email: "test@example.com",
        password: "pass",
      });
      expect(result).toEqual({ id: 1, email: "test@example.com" });
    });
    it("should throw 400 on invalid input", async () => {
      mockService.register.mockImplementation(() => {
        throw { status: 400, message: "Bad Request" };
      });
      await expect(controller.register({} as any)).rejects.toMatchObject({
        status: 400,
      });
    });
  });

  describe("login", () => {
    it("should login a user and return a token", async () => {
      mockService.login.mockResolvedValue({ access_token: "jwt" });
      const result = await controller.login({
        email: "test@example.com",
        password: "pass",
      });
      expect(result).toEqual({ access_token: "jwt" });
    });
    it("should throw 401 on invalid credentials", async () => {
      mockService.login.mockImplementation(() => {
        throw { status: 401, message: "Unauthorized" };
      });
      await expect(
        controller.login({ email: "bad", password: "bad" })
      ).rejects.toMatchObject({ status: 401 });
    });
  });
});
