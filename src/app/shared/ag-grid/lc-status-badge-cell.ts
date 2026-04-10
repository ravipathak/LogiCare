import type { ICellRendererParams } from 'ag-grid-community';

/** Optional `cellRendererParams` when using `lcStatusBadgeCellRenderer`. */
export type LcStatusBadgeMode = 'activeOnly' | 'activeInactive';

export interface LcStatusBadgeCellParams {
  /** Override default: value === 'Active' (only when `mode` is `activeOnly`). */
  isActive?: (value: unknown) => boolean;
  /**
   * `activeOnly` (default): Active = green accent; other values = neutral pill.
   * `activeInactive`: Active = green, Inactive = coral/red (e.g. contacts).
   */
  mode?: LcStatusBadgeMode;
}

/**
 * Plain DOM cell renderer for status pills (no extra Angular component).
 */
export function lcStatusBadgeCellRenderer(params: ICellRendererParams): HTMLElement {
  const span = document.createElement('span');
  const value = params.value != null ? String(params.value) : '';
  span.textContent = value;

  const extra = params.colDef?.cellRendererParams as LcStatusBadgeCellParams | undefined;
  const mode = extra?.mode ?? 'activeOnly';

  if (mode === 'activeInactive') {
    if (value === 'Active') {
      span.className = 'lc-status-badge lc-status-badge--active';
    } else if (value === 'Inactive') {
      span.className = 'lc-status-badge lc-status-badge--inactive';
    } else {
      span.className = 'lc-status-badge';
    }
    return span;
  }

  const active = extra?.isActive?.(params.value) ?? value === 'Active';
  span.className = active ? 'lc-status-badge lc-status-badge--active' : 'lc-status-badge';
  return span;
}
