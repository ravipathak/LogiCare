import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

import { ToastService } from '../../services/toast.service';

function atLeastOneCategory(control: AbstractControl): ValidationErrors | null {
  const v = control.value as string[] | null | undefined;
  return v && v.length > 0 ? null : { categoriesRequired: true };
}

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-create-standard-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatIconModule,
  ],
  templateUrl: './create-standard-page.component.html',
  styleUrl: './create-standard-page.component.scss',
})
export class CreateStandardPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  selectedTabIndex = 0;

  readonly locationOptions: SelectOption[] = [
    { value: 'loc-1', label: 'Main Lab' },
    { value: 'loc-2', label: 'North Campus' },
  ];

  readonly contactOptions: SelectOption[] = [
    { value: 'con-1', label: 'Lab Manager' },
    { value: 'con-2', label: 'QA Lead' },
  ];

  readonly departmentOptions: SelectOption[] = [
    { value: 'dep-1', label: 'Quality' },
    { value: 'dep-2', label: 'Operations' },
  ];

  readonly roomOptions: SelectOption[] = [
    { value: 'room-1', label: 'Room 101' },
    { value: 'room-2', label: 'Room B12' },
  ];

  readonly categoryOptions: SelectOption[] = [
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'dimensional', label: 'Dimensional' },
    { value: 'thermal', label: 'Thermal' },
  ];

  readonly form = this.fb.nonNullable.group({
    locationId: ['', Validators.required],
    contactId: ['', Validators.required],
    departmentId: ['', Validators.required],
    roomId: ['', Validators.required],
    categories: this.fb.nonNullable.control<string[]>([], { validators: [atLeastOneCategory] }),
    idNumber: ['', Validators.required],
    alternateTrackingNo: [''],
    description: ['', Validators.required],
    systemName: ['', Validators.required],
    serialNo: [''],
    make: ['', Validators.required],
    modelNo: ['', Validators.required],
    attributes: this.fb.array<FormGroup>([]),
    calibrationScheduleEnabled: [false],
    pmScheduleEnabled: [false],
    pmApplyCertificate: [false],
    validationScheduleEnabled: [false],
    comments: [''],
  });

  get attributes(): FormArray<FormGroup> {
    return this.form.controls.attributes as FormArray<FormGroup>;
  }

  attributeGroup(): FormGroup {
    return this.fb.group({
      category: [''],
      engUnits: [''],
      operRange: [''],
      accuracy: [''],
      resolution: [''],
      calTolerance: [''],
      calUnits: [''],
    });
  }

  addAttributeRow(): void {
    this.attributes.push(this.attributeGroup());
  }

  removeAttributeRow(index: number): void {
    this.attributes.removeAt(index);
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.selectedTabIndex = 0;
      return;
    }
    console.debug('[Schedule] create standard', this.form.getRawValue());
    this.toast.success('Standard will be saved when the API is connected.');
    void this.router.navigate(['/admin/schedule']);
  }
}
