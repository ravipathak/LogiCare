import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridOptions } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { DepartmentsService, type DepartmentRow } from '../../../services/departments.service';
import {
  createDefaultLogiCareGridOptions,
  LcActionsCellComponent,
  lcStatusBadgeCellRenderer,
} from '../../../shared/ag-grid';

@Component({
  selector: 'app-departments-tab',
  standalone: true,
  imports: [
    AsyncPipe,
    AgGridAngular,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './departments-tab.component.html',
  styleUrl: './departments-tab.component.scss',
})
export class DepartmentsTabComponent {
  private readonly departmentsService = inject(DepartmentsService);

  readonly rowData$ = this.departmentsService.getDepartments();

  readonly gridOptions: GridOptions<DepartmentRow> = {
    ...createDefaultLogiCareGridOptions<DepartmentRow>(),
    domLayout: 'autoHeight',
  };

  readonly columnDefs: ColDef<DepartmentRow>[] = [
    {
      field: 'locationName',
      headerName: 'Location Name',
      minWidth: 180,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'departmentName',
      headerName: 'Department Name',
      minWidth: 180,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'departmentDescription',
      headerName: 'Department Description',
      minWidth: 220,
      flex: 1,
      filter: 'agTextColumnFilter',
      tooltipField: 'departmentDescription',
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
        ariaLabel: 'Open department actions',
        actions: (_data: DepartmentRow | undefined) => [
          {
            id: 'view',
            label: 'View department',
            materialIcon: 'visibility',
            run: (row: DepartmentRow | undefined) =>
              console.debug('[Departments] view', row?.departmentName),
          },
          {
            id: 'edit',
            label: 'Edit department',
            materialIcon: 'edit',
            run: (row: DepartmentRow | undefined) =>
              console.debug('[Departments] edit', row?.departmentName),
          },
          {
            id: 'inactive',
            label: 'Make inactive',
            materialIcon: 'toggle_off',
            visible: (row: DepartmentRow | undefined) => row?.status === 'Active',
            run: (row: DepartmentRow | undefined) =>
              console.debug('[Departments] make inactive', row?.departmentName),
          },
          {
            id: 'delete',
            label: 'Delete',
            materialIcon: 'delete_outline',
            danger: true,
            run: (row: DepartmentRow | undefined) =>
              console.debug('[Departments] delete', row?.departmentName),
          },
        ],
      },
    },
  ];
}
