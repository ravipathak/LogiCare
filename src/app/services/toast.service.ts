import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Semantic toast variants; styled globally in `styles.scss` (`.lc-toast--*`). */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  private static readonly defaultDurations: Record<ToastVariant, number> = {
    success: 4000,
    error: 5500,
    warning: 4500,
    info: 4000,
  };

  /**
   * Shows a toast. Prefer `success` / `error` / `warning` / `info` for clarity at call sites.
   */
  show(message: string, variant: ToastVariant = 'info', durationMs?: number): void {
    this.snackBar.open(message, undefined, {
      duration: durationMs ?? ToastService.defaultDurations[variant],
      panelClass: ['lc-toast', `lc-toast--${variant}`],
      horizontalPosition: 'end',
      verticalPosition: 'top',
      politeness: variant === 'error' ? 'assertive' : 'polite',
    });
  }

  success(message: string, durationMs?: number): void {
    this.show(message, 'success', durationMs);
  }

  error(message: string, durationMs?: number): void {
    this.show(message, 'error', durationMs);
  }

  warning(message: string, durationMs?: number): void {
    this.show(message, 'warning', durationMs);
  }

  info(message: string, durationMs?: number): void {
    this.show(message, 'info', durationMs);
  }
}
