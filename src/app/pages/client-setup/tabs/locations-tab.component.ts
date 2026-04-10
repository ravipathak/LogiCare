import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridOptions } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';

import { LocationsService, type LocationRow } from '../../../services/locations.service';
import { CreateLocationDialogComponent } from '../dialogs/create-location-dialog.component';
import {
  createDefaultLogiCareGridOptions,
  LcActionsCellComponent,
  lcStatusBadgeCellRenderer,
} from '../../../shared/ag-grid';

@Component({
  selector: 'app-locations-tab',
  standalone: true,
  imports: [
    AsyncPipe,
    AgGridAngular,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './locations-tab.component.html',
  styleUrl: './locations-tab.component.scss',
})
export class LocationsTabComponent {
  private readonly locationsService = inject(LocationsService);
  private readonly dialog = inject(MatDialog);

  readonly rowData$ = this.locationsService.getLocations();

  openCreateLocation(): void {
    const ref = this.dialog.open(CreateLocationDialogComponent, {
      width: '750px',
      maxWidth: '95vw',
      panelClass: 'lc-create-location-dialog-panel',
      autoFocus: 'first-tabbable',
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        console.debug('[Locations] create location', result);
      }
    });
  }

  readonly gridOptions: GridOptions<LocationRow> = {
    ...createDefaultLogiCareGridOptions<LocationRow>(),
    domLayout: 'autoHeight',
  };

  readonly columnDefs: ColDef<LocationRow>[] = [
    {
      field: 'locationName',
      headerName: 'Location Name',
      minWidth: 240,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 240,
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
        ariaLabel: 'Open location actions',
        actions: (_data: LocationRow | undefined) => [
          {
            id: 'view',
            label: 'View location',
            materialIcon: 'visibility',
            run: (row: LocationRow | undefined) =>
              console.debug('[Locations] view', row?.locationName),
          },
          {
            id: 'edit',
            label: 'Edit location',
            materialIcon: 'edit',
            run: (row: LocationRow | undefined) =>
              console.debug('[Locations] edit', row?.locationName),
          },
          {
            id: 'inactive',
            label: 'Make inactive',
            materialIcon: 'toggle_off',
            visible: (row: LocationRow | undefined) => row?.status === 'Active',
            run: (row: LocationRow | undefined) =>
              console.debug('[Locations] make inactive', row?.locationName),
          },
          {
            id: 'delete',
            label: 'Delete',
            materialIcon: 'delete_outline',
            danger: true,
            run: (row: LocationRow | undefined) =>
              console.debug('[Locations] delete', row?.locationName),
          },
        ],
      },
    },
  ];
}
