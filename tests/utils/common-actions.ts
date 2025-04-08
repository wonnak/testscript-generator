import { Page } from '@playwright/test';

interface LoginCredentials {
  id: string;
  password: string;
}

export class CommonActions {
  constructor(private page: Page) {}

  async login({ id, password }: LoginCredentials) {
    await this.page.getByLabel('아이디').fill(id);
    await this.page.getByLabel('비밀번호').fill(password);
    await this.page.getByRole('button', { name: '로그인' }).click();
  }
} 