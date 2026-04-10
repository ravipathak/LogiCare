import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridOptions } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';

import { ContactsService, type ContactRow } from '../../../services/contacts.service';
import { CreateContactDialogComponent } from '../dialogs/create-contact-dialog.component';
import {
  createDefaultLogiCareGridOptions,
  LcActionsCellComponent,
  lcStatusBadgeCellRenderer,
} from '../../../shared/ag-grid';

@Component({
  selector: 'app-contacts-tab',
  standalone: true,
  imports: [
    AsyncPipe,
    AgGridAngular,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './contacts-tab.component.html',
  styleUrl: './contacts-tab.component.scss',
})
export class ContactsTabComponent {
  private readonly contactsService = inject(ContactsService);
  private readonly dialog = inject(MatDialog);

  readonly rowData$ = this.contactsService.getContacts();

  openCreateContact(): void {
    const ref = this.dialog.open(CreateContactDialogComponent, {
      width: '750px',
      maxWidth: '95vw',
      panelClass: 'lc-create-contact-dialog-panel',
      autoFocus: 'first-tabbable',
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        console.debug('[Contacts] create contact', result);
      }
    });
  }

  readonly gridOptions: GridOptions<ContactRow> = {
    ...createDefaultLogiCareGridOptions<ContactRow>(),
    domLayout: 'autoHeight',
  };

  readonly columnDefs: ColDef<ContactRow>[] = [
    {
      field: 'locationName',
      headerName: 'Location Name',
      minWidth: 180,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'contactName',
      headerName: 'Contact Name',
      minWidth: 160,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'phone',
      headerName: 'Phone',
      minWidth: 140,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 220,
      flex: 1,
      filter: 'agTextColumnFilter',
      tooltipField: 'email',
    },
    {
      field: 'status',
      headerName: 'Status',
      maxWidth: 130,
      minWidth: 110,
      filter: 'agTextColumnFilter',
      cellClass: 'lc-cell--status',
      cellRenderer: lcStatusBadgeCellRenderer,
      cellRendererParams: { mode: 'activeInactive' },
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
        ariaLabel: 'Open contact actions',
        actions: (_data: ContactRow | undefined) => [
          {
            id: 'view',
            label: 'View contact',
            materialIcon: 'visibility',
            run: (row: ContactRow | undefined) =>
              console.debug('[Contacts] view', row?.contactName),
          },
          {
            id: 'edit',
            label: 'Edit contact',
            materialIcon: 'edit',
            run: (row: ContactRow | undefined) =>
              console.debug('[Contacts] edit', row?.contactName),
          },
          {
            id: 'delete',
            label: 'Delete',
            materialIcon: 'delete_outline',
            danger: true,
            run: (row: ContactRow | undefined) =>
              console.debug('[Contacts] delete', row?.contactName),
          },
        ],
      },
    },
  ];
}
