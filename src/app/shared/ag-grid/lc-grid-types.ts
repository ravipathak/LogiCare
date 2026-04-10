/**
 * Shared AG Grid helpers for LogiCare data tables.
 * Use `cellRendererParams` on the Actions column to define menu items per grid.
 */

/** One row action in the shared `LcActionsCellComponent` menu. */
export interface LcGridAction<T = unknown> {
  id: string;
  label: string;
  materialIcon: string;
  danger?: boolean;
  /** If provided, action is hidden when this returns false. */
  visible?: (row: T | undefined) => boolean;
  run: (row: T | undefined) => void;
}

/** Pass via `colDef.cellRendererParams` when using `LcActionsCellComponent`. */
export interface LcActionsCellColParams<T = unknown> {
  /** Shown on the menu trigger. */
  ariaLabel?: string;
  /** Static list or a factory so each row can differ (e.g. conditional items). */
  actions: LcGridAction<T>[] | ((data: T | undefined) => LcGridAction<T>[]);
}
