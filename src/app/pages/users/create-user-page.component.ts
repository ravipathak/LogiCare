import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { USER_ROLE_OPTIONS, type UserRole } from '../../models/user-role';
import { ToastService } from '../../services/toast.service';

export interface CreateUserSubmitPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: UserRole[];
  locationId: string | null;
  profileFile: File | null;
}

function passwordGroupValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value as string | undefined;
  const conf = group.get('confirmPassword')?.value as string | undefined;
  if (!pass || !conf) {
    return null;
  }
  return pass === conf ? null : { passwordMismatch: true };
}

function atLeastOneRole(control: AbstractControl): ValidationErrors | null {
  const roles = control.value as UserRole[] | null | undefined;
  return roles && roles.length > 0 ? null : { rolesRequired: true };
}

@Component({
  selector: 'app-create-user-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './create-user-page.component.html',
  styleUrl: './create-user-page.component.scss',
})
export class CreateUserPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly roleOptions = USER_ROLE_OPTIONS;

  readonly profileFileName = signal<string>('No file selected');
  private readonly profileFile = signal<File | null>(null);

  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);

  readonly form = this.fb.nonNullable.group(
    {
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      roles: [[] as UserRole[], atLeastOneRole],
      locationId: [''],
    },
    { validators: [passwordGroupValidator] },
  );

  onProfileFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.profileFile.set(file ?? null);
    this.profileFileName.set(file?.name ?? 'No file selected');
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const roles = v.roles;
    if (!roles.length) {
      return;
    }

    const payload: CreateUserSubmitPayload = {
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      password: v.password,
      roles,
      locationId: v.locationId || null,
      profileFile: this.profileFile(),
    };

    console.debug('[Users] create user submit', payload);
    this.toast.success('User will be saved when the API is connected.');
    void this.router.navigate(['/admin/users']);
  }
}
