import { Injectable } from '@angular/core';
import type { UserRole } from '../models/user-role';

const AUTH_STORAGE_KEY = 'lc_auth';
const ROLE_STORAGE_KEY = 'lc_role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly validEmail = 'ravipathak82@gmail.com';
  private readonly validPassword = 'Test123!';

  isAuthenticated(): boolean {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === '1';
  }

  /** Role chosen at login; available for shell / guards after auth. */
  getRole(): UserRole | null {
    const raw = sessionStorage.getItem(ROLE_STORAGE_KEY);
    if (
      raw === 'admin' ||
      raw === 'reviewer' ||
      raw === 'operator' ||
      raw === 'superadmin'
    ) {
      return raw;
    }
    return null;
  }

  login(email: string, password: string, role: UserRole): boolean {
    const ok =
      email.trim() === this.validEmail && password === this.validPassword;
    if (ok) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, '1');
      sessionStorage.setItem(ROLE_STORAGE_KEY, role);
    }
    return ok;
  }

  logout(): void {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(ROLE_STORAGE_KEY);
  }
}
