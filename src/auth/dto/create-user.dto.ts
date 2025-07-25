export class CreateUserDto {
  email!: string;
  password!: string;
  role?: string; // optional, default to 'user'
}
