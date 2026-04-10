import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridOptions } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { GroupsService, type GroupRow } from '../../../services/groups.service';
import {
  createDefaultLogiCareGridOptions,
  LcActionsCellComponent,
  lcStatusBadgeCellRenderer,
} from '../../../shared/ag-grid';

@Component({
  selector: 'app-groups-tab',
  standalone: true,
  imports: [
    AsyncPipe,
    AgGridAngular,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './groups-tab.component.html',
  styleUrl: './groups-tab.component.scss',
})
export class GroupsTabComponent {
  private readonly groupsService = inject(GroupsService);

  readonly rowData$ = this.groupsService.getGroups();

  readonly gridOptions: GridOptions<GroupRow> = {
    ...createDefaultLogiCareGridOptions<GroupRow>(),
    domLayout: 'autoHeight',
  };

  readonly columnDefs: ColDef<GroupRow>[] = [
    {
      field: 'groupName',
      headerName: 'Group Name',
      minWidth: 200,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 200,
      flex: 1,
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
        ariaLabel: 'Open group actions',
        actions: (_data: GroupRow | undefined) => [
          {
            id: 'view',
            label: 'View group',
            materialIcon: 'visibility',
            run: (row: GroupRow | undefined) => console.debug('[Groups] view', row?.groupName),
          },
          {
            id: 'edit',
            label: 'Edit group',
            materialIcon: 'edit',
            run: (row: GroupRow | undefined) => console.debug('[Groups] edit', row?.groupName),
          },
          {
            id: 'inactive',
            label: 'Make inactive',
            materialIcon: 'toggle_off',
            visible: (row: GroupRow | undefined) => row?.status === 'Active',
            run: (row: GroupRow | undefined) =>
              console.debug('[Groups] make inactive', row?.groupName),
          },
          {
            id: 'delete',
            label: 'Delete',
            materialIcon: 'delete_outline',
            danger: true,
            run: (row: GroupRow | undefined) => console.debug('[Groups] delete', row?.groupName),
          },
        ],
      },
    },
  ];
}
