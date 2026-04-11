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
import { ScheduleService, type ScheduleAssetRow } from '../../../services/schedule.service';

@Component({
  selector: 'app-schedule-assets-tab',
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
  templateUrl: './schedule-assets-tab.component.html',
  styleUrl: './schedule-assets-tab.component.scss',
})
export class ScheduleAssetsTabComponent {
  private readonly scheduleService = inject(ScheduleService);

  readonly locationFilter = signal<string>('all');
  readonly searchText = signal('');

  readonly rowData$ = this.scheduleService.getAssets();
  readonly rows = toSignal(this.rowData$, { initialValue: [] as ScheduleAssetRow[] });
  readonly isEmpty = computed(() => this.rows().length === 0);

  readonly gridOptions: GridOptions<ScheduleAssetRow> = {
    ...createDefaultLogiCareGridOptions<ScheduleAssetRow>(),
    domLayout: 'normal',
  };

  readonly columnDefs: ColDef<ScheduleAssetRow>[] = [
    {
      field: 'idNumber',
      headerName: 'ID Number',
      minWidth: 110,
      maxWidth: 130,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'systemName',
      headerName: 'System Name',
      minWidth: 160,
      flex: 1,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 200,
      flex: 2,
      filter: 'agTextColumnFilter',
      tooltipField: 'description',
    },
    {
      field: 'make',
      headerName: 'Make',
      minWidth: 120,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'modelNo',
      headerName: 'Model No.',
      minWidth: 120,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'calDueDate',
      headerName: 'Cal. Due Date',
      minWidth: 130,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'status',
      headerName: 'Status',
      maxWidth: 120,
      minWidth: 100,
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
        ariaLabel: 'Open asset actions',
        actions: (_data: ScheduleAssetRow | undefined) => [
          {
            id: 'view',
            label: 'View',
            materialIcon: 'visibility',
            run: (row: ScheduleAssetRow | undefined) =>
              console.debug('[Schedule] view asset', row?.idNumber),
          },
          {
            id: 'edit',
            label: 'Edit',
            materialIcon: 'edit',
            run: (row: ScheduleAssetRow | undefined) =>
              console.debug('[Schedule] edit asset', row?.idNumber),
          },
        ],
      },
    },
  ];

  addAsset(): void {}
}
