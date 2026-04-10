import { Injectable } from '@angular/core';

const AUTH_STORAGE_KEY = 'lc_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly validEmail = 'ravipathak82@gmail.com';
  private readonly validPassword = 'Test123!';

  isAuthenticated(): boolean {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === '1';
  }

  login(email: string, password: string): boolean {
    const ok =
      email.trim() === this.validEmail && password === this.validPassword;
    if (ok) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, '1');
    }
    return ok;
  }

  logout(): void {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
