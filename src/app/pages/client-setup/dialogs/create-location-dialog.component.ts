import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { US_STATE_OPTIONS } from '../../../shared/data/us-states';

export interface CreateLocationDialogResult {
  locationName: string;
  locationDescription: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

@Component({
  selector: 'app-create-location-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './create-location-dialog.component.html',
  styleUrl: './create-location-dialog.component.scss',
})
export class CreateLocationDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<CreateLocationDialogComponent, CreateLocationDialogResult | undefined>);

  readonly stateOptions = US_STATE_OPTIONS;

  readonly form = this.fb.nonNullable.group({
    locationName: ['', Validators.required],
    locationDescription: ['', Validators.required],
    address1: ['', Validators.required],
    address2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', Validators.required],
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
