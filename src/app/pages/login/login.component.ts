import { Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { USER_ROLE_OPTIONS, type UserRole } from '../../models/user-role';
import { AuthService } from '../../services/auth.service';
import { PageLoaderService } from '../../services/page-loader.service';
import { ToastService } from '../../services/toast.service';
import { LcPageLoaderComponent } from '../../shared/ui/lc-page-loader/lc-page-loader.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    LcPageLoaderComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  readonly pageLoader = inject(PageLoaderService);

  /** 1 = email only; 2 = role + password + sign in */
  readonly step = signal<1 | 2>(1);

  readonly roleOptions = USER_ROLE_OPTIONS;

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: [null as UserRole | null],
  });

  onContinueEmail(): void {
    const emailCtrl = this.form.controls.email;
    emailCtrl.markAsTouched();
    if (emailCtrl.invalid) {
      return;
    }
    this.form.controls.password.setValidators([Validators.required]);
    this.form.controls.role.setValidators([Validators.required]);
    this.form.controls.password.updateValueAndValidity({ emitEvent: false });
    this.form.controls.role.updateValueAndValidity({ emitEvent: false });
    this.step.set(2);
  }

  onBackToEmail(): void {
    this.step.set(1);
    this.form.controls.password.clearValidators();
    this.form.controls.role.clearValidators();
    this.form.controls.password.setValue('');
    this.form.controls.role.setValue(null);
    this.form.controls.password.updateValueAndValidity({ emitEvent: false });
    this.form.controls.role.updateValueAndValidity({ emitEvent: false });
    this.form.controls.password.markAsUntouched();
    this.form.controls.role.markAsUntouched();
  }

  selectRole(role: UserRole): void {
    this.form.patchValue({ role });
    this.form.controls.role.markAsTouched();
  }

  async onSubmit(): Promise<void> {
    if (this.step() === 1) {
      this.onContinueEmail();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const email = raw.email;
    const password = raw.password;
    const role = raw.role;

    if (!role) {
      this.form.controls.role.markAsTouched();
      return;
    }

    if (!this.auth.login(email, password, role)) {
      this.toast.error('Invalid email or password. Please try again.');
      return;
    }
    this.toast.success('Signed in successfully.');
    await this.pageLoader.track(
      new Promise<void>(resolve => setTimeout(resolve, 1100)),
    );
    await this.router.navigate(['/home']);
  }
}
