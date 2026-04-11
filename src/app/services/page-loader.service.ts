import { Injectable, computed, signal } from '@angular/core';

/**
 * Global / shared loading overlay. Use `show` / `hide` with ref-counting for real HTTP calls,
 * or `flash(ms)` to simulate latency (e.g. tab switches) until APIs are wired.
 */
@Injectable({ providedIn: 'root' })
export class PageLoaderService {
  private readonly depth = signal(0);

  readonly visible = computed(() => this.depth() > 0);

  show(): void {
    this.depth.update(d => d + 1);
  }

  hide(): void {
    this.depth.update(d => Math.max(0, d - 1));
  }

  /** Clears all overlays (e.g. shell destroyed mid-navigation). */
  reset(): void {
    this.depth.set(0);
  }

  /** Shows the loader for a fixed duration (demo / simulated API). */
  flash(durationMs = 1100): void {
    this.show();
    setTimeout(() => this.hide(), durationMs);
  }

  async track<T>(work: Promise<T>): Promise<T> {
    this.show();
    try {
      return await work;
    } finally {
      this.hide();
    }
  }
}
