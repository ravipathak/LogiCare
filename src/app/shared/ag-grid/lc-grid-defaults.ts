import type { GridOptions } from 'ag-grid-community';

/**
 * Opinionated defaults for LogiCare AG Grid tables (alpine theme + app SCSS).
 * Spread and override per screen (e.g. `domLayout: 'autoHeight'` in tab panels).
 */
export function createDefaultLogiCareGridOptions<T>(): GridOptions<T> {
  return {
    defaultColDef: {
      sortable: true,
      filter: true,
      floatingFilter: false,
      resizable: true,
      flex: 1,
      minWidth: 160,
    },
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 25, 50],
    suppressCellFocus: true,
    animateRows: true,
    rowHeight: 44,
    headerHeight: 44,
    domLayout: 'normal',
    onGridReady: e => {
      // Tab panels / hidden panels can mount before layout is visible — redraw after paint.
      setTimeout(() => e.api.redrawRows(), 0);
      setTimeout(() => e.api.redrawRows(), 200);
    },
  };
}
