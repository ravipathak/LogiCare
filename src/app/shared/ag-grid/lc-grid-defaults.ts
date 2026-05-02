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
    /** Avoid AG Grid’s `.ag-row-hover::before` overlay — it fights custom row CSS and clips as white edge bands. */
    suppressRowHoverHighlight: true,
    animateRows: true,
    /** Match Client Setup grid theme `--ag-header-height` / `--ag-row-height` in `_lc-client-setup-grid.scss`. */
    rowHeight: 56,
    headerHeight: 48,
    domLayout: 'normal',
    /**
     * Keeps column widths pinned to the grid body width so `.ag-row` borders span the full white card
     * (avoids short horizontal dividers when total column width is below the viewport).
     * @agModule ColumnAutoSizeModule (included in AllCommunityModule)
     */
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 80,
    },
    onGridReady: e => {
      const api = e.api;
      const sync = () => {
        try {
          api.sizeColumnsToFit();
        } catch {
          /* e.g. zero-width host during first paint */
        }
        api.redrawRows();
      };
      // Tab panels / hidden panels can mount before layout is visible — sync after paint.
      for (const ms of [0, 50, 120, 280, 450, 700]) {
        setTimeout(sync, ms);
      }
    },
    onGridSizeChanged: e => {
      try {
        e.api.sizeColumnsToFit();
      } catch {
        /* ignore */
      }
      e.api.redrawRows();
    },
    onFirstDataRendered: e => {
      try {
        e.api.sizeColumnsToFit();
      } catch {
        /* ignore */
      }
      e.api.redrawRows();
    },
    onPaginationChanged: e => {
      try {
        e.api.sizeColumnsToFit();
      } catch {
        /* ignore */
      }
    },
  };
}
