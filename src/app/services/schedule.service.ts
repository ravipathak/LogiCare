import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/** Placeholder row for Standards tab until scheduling API exists. */
export interface ScheduleStandardRow {
  standardId: string;
  name: string;
  description: string;
  status: string;
}

/** Placeholder row for Assets tab (columns aligned with manage-assets reference). */
export interface ScheduleAssetRow {
  idNumber: string;
  systemName: string;
  description: string;
  make: string;
  modelNo: string;
  calDueDate: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  getStandards(): Observable<ScheduleStandardRow[]> {
    return of([]);
  }

  getAssets(): Observable<ScheduleAssetRow[]> {
    return of([]);
  }
}
