import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { environment } from '../../environments/environment';

export type DepartmentStatus = 'Active' | 'Inactive';

export interface DepartmentRow {
  locationName: string;
  departmentName: string;
  departmentDescription: string;
  status: DepartmentStatus;
}

@Injectable({ providedIn: 'root' })
export class DepartmentsService {
  private readonly http = inject(HttpClient);

  private readonly departmentsShared$ = this.http
    .get<DepartmentRow[]>(environment.endpoints.departments)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  getDepartments(): Observable<DepartmentRow[]> {
    return this.departmentsShared$;
  }
}
