import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AgGridAngular } from 'ag-grid-angular';
import type {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import type { UserRow } from '../../services/users.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../services/toast.service';
import {
  createDefaultLogiCareGridOptions,
  LcActionsCellComponent,
  lcStatusBadgeCellRenderer,
} from '../../shared/ag-grid';

function avatarCellRenderer(): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'lc-user-avatar-cell';
  wrap.innerHTML = `
    <div class="lc-user-avatar-cell__box">
      <span class="material-icons lc-user-avatar-cell__icon" aria-hidden="true">person</span>
      <span class="lc-user-avatar-cell__hint">NO IMAGE FOUND</span>
    </div>`;
  return wrap;
}

function rolesCellRenderer(params: ICellRendererParams<UserRow>): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'lc-user-roles-cell';
  for (const text of params.data?.roles ?? []) {
    const line = document.createElement('span');
    line.className = 'lc-user-roles-cell__line';
    line.textContent = text;
    wrap.appendChild(line);
  }
  return wrap;
}

export type UserStatusFilter = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    AgGridAngular,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
  private readonly usersService = inject(UsersService);
  private readonly toast = inject(ToastService);

  private gridApi: GridApi<UserRow> | null = null;

  readonly statusFilter = signal<UserStatusFilter>('active');
  readonly searchText = signal('');
  readonly pageSize = signal(10);

  readonly allRows = toSignal(this.usersService.getUsers(), { initialValue: [] as UserRow[] });

  readonly filteredRows = computed(() => {
    let rows = this.allRows();
    const st = this.statusFilter();
    if (st === 'active') {
      rows = rows.filter(r => r.status === 'Active');
    } else if (st === 'inactive') {
      rows = rows.filter(r => r.status === 'Inactive');
    }
    const q = this.searchText().trim().toLowerCase();
    if (!q) {
      return rows;
    }
    return rows.filter(r => {
      const blob = [r.firstName, r.lastName, r.email, ...r.roles].join(' ').toLowerCase();
      return blob.includes(q);
    });
  });

  readonly gridOptions: GridOptions<UserRow> = {
    ...createDefaultLogiCareGridOptions<UserRow>(),
    paginationPageSize: 10,
    getRowHeight: params => {
      const n = params.data?.roles.length ?? 1;
      return Math.min(132, Math.max(48, 36 + n * 22));
    },
    onGridReady: (e: GridReadyEvent<UserRow>) => {
      const defaults = createDefaultLogiCareGridOptions<UserRow>().onGridReady;
      defaults?.(e);
      this.gridApi = e.api;
      e.api.applyColumnState({
        state: [{ colId: 'firstName', sort: 'asc' }],
      });
    },
  };

  readonly columnDefs: ColDef<UserRow>[] = [
    {
      colId: 'avatar',
      headerName: 'User Image',
      maxWidth: 120,
      minWidth: 108,
      sortable: false,
      filter: false,
      cellRenderer: avatarCellRenderer,
      cellClass: 'lc-cell--avatar',
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      minWidth: 120,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      minWidth: 120,
      filter: 'agTextColumnFilter',
    },
    {
      colId: 'roles',
      headerName: 'Role',
      minWidth: 140,
      flex: 1,
      filter: 'agTextColumnFilter',
      valueGetter: p => p.data?.roles.join(', '),
      cellRenderer: rolesCellRenderer,
      cellClass: 'lc-cell--roles',
    },
    {
      field: 'email',
      headerName: 'Username / Email ID',
      minWidth: 240,
      flex: 2,
      filter: 'agTextColumnFilter',
      tooltipField: 'email',
    },
    {
      field: 'statusUpdatedOn',
      headerName: 'Status Updated On',
      minWidth: 140,
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
      cellRendererParams: { mode: 'activeInactive' as const },
    },
    {
      headerName: 'Actions',
      colId: 'actions',
      maxWidth: 130,
      minWidth: 112,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMovable: true,
      cellClass: 'lc-cell--actions',
      cellRenderer: LcActionsCellComponent,
      cellRendererParams: {
        ariaLabel: 'Open user actions',
        actions: (_data: UserRow | undefined) => [
          {
            id: 'view',
            label: 'View user',
            materialIcon: 'visibility',
            run: (row: UserRow | undefined) =>
              console.debug('[Users] view', row?.email),
          },
          {
            id: 'edit',
            label: 'Edit user',
            materialIcon: 'edit',
            run: (row: UserRow | undefined) =>
              console.debug('[Users] edit', row?.email),
          },
          {
            id: 'inactive',
            label: 'Deactivate',
            materialIcon: 'toggle_off',
            visible: (row: UserRow | undefined) => row?.status === 'Active',
            run: (row: UserRow | undefined) =>
              console.debug('[Users] deactivate', row?.email),
          },
          {
            id: 'delete',
            label: 'Delete',
            materialIcon: 'delete_outline',
            danger: true,
            run: (row: UserRow | undefined) =>
              console.debug('[Users] delete', row?.email),
          },
        ],
      },
    },
  ];

  onStatusChange(value: UserStatusFilter): void {
    this.statusFilter.set(value);
  }

  onSearchInput(value: string): void {
    this.searchText.set(value);
  }

  onPageSizeChange(value: number): void {
    this.pageSize.set(value);
    this.gridApi?.setGridOption('paginationPageSize', value);
  }

  printPdf(): void {
    this.toast.info('PDF export will run when reporting is connected.');
    window.print();
  }

  createUser(): void {
    this.toast.info('Create User will open when the user API is available.');
  }
}
