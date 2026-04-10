import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { LocationsService } from '../../../services/locations.service';

export interface CreateContactDialogResult {
  locationName: string;
  contactName: string;
  phone: string;
  email: string;
}

/** US-style phone: 000-000-0000 */
const PHONE_PATTERN = /^\d{3}-\d{3}-\d{4}$/;

@Component({
  selector: 'app-create-contact-dialog',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './create-contact-dialog.component.html',
  styleUrl: './create-contact-dialog.component.scss',
})
export class CreateContactDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly locationsService = inject(LocationsService);
  readonly dialogRef = inject(MatDialogRef<CreateContactDialogComponent, CreateContactDialogResult | undefined>);

  readonly locations$ = this.locationsService.getLocations();

  readonly form = this.fb.nonNullable.group({
    locationName: ['', Validators.required],
    contactName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
    email: ['', [Validators.required, Validators.email]],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }

  close(): void {
    this.dialogRef.close(undefined);
  }
}
