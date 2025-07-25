export class DepositDto {
  accountId!: number;
  amount!: number;
}

export class WithdrawDto {
  accountId!: number;
  amount!: number;
}

export class TransferDto {
  fromAccountId!: number;
  toAccountId!: number;
  amount!: number;
}
