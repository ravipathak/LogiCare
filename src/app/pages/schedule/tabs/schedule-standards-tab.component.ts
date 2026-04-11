import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridOptions } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  createDefaultLogiCareGridOptions,
  LcActionsCellComponent,
  lcStatusBadgeCellRenderer,
} from '../../../shared/ag-grid';
import { ScheduleService, type ScheduleStandardRow } from '../../../services/schedule.service';

@Component({
  selector: 'app-schedule-standards-tab',
  standalone: true,
  imports: [
    AsyncPipe,
    AgGridAngular,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './schedule-standards-tab.component.html',
  styleUrl: './schedule-standards-tab.component.scss',
})
export class ScheduleStandardsTabComponent {
  private readonly scheduleService = inject(ScheduleService);

  readonly locationFilter = signal<string>('all');
  readonly searchText = signal('');

  readonly rowData$ = this.scheduleService.getStandards();
  readonly rows = toSignal(this.rowData$, { initialValue: [] as ScheduleStandardRow[] });
  readonly isEmpty = computed(() => this.rows().length === 0);

  readonly gridOptions: GridOptions<ScheduleStandardRow> = {
    ...createDefaultLogiCareGridOptions<ScheduleStandardRow>(),
    domLayout: 'normal',
  };

  readonly columnDefs: ColDef<ScheduleStandardRow>[] = [
    {
      field: 'standardId',
      headerName: 'Standard ID',
      minWidth: 120,
      maxWidth: 140,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 180,
      flex: 1,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 220,
      flex: 2,
      filter: 'agTextColumnFilter',
      tooltipField: 'description',
    },
    {
      field: 'status',
      headerName: 'Status',
      maxWidth: 130,
      minWidth: 110,
      filter: 'agTextColumnFilter',
      cellClass: 'lc-cell--status',
      cellRenderer: lcStatusBadgeCellRenderer,
    },
    {
      headerName: 'Actions',
      colId: 'actions',
      maxWidth: 120,
      minWidth: 96,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMovable: true,
      cellClass: 'lc-cell--actions',
      cellRenderer: LcActionsCellComponent,
      cellRendererParams: {
        ariaLabel: 'Open standard actions',
        actions: (_data: ScheduleStandardRow | undefined) => [
          {
            id: 'view',
            label: 'View',
            materialIcon: 'visibility',
            run: (row: ScheduleStandardRow | undefined) =>
              console.debug('[Schedule] view standard', row?.standardId),
          },
          {
            id: 'edit',
            label: 'Edit',
            materialIcon: 'edit',
            run: (row: ScheduleStandardRow | undefined) =>
              console.debug('[Schedule] edit standard', row?.standardId),
          },
        ],
      },
    },
  ];

  addStandard(): void {}
}
