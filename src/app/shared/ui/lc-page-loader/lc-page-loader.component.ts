import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type LcPageLoaderMode = 'contained' | 'fullscreen';

@Component({
  selector: 'lc-page-loader',
  standalone: true,
  templateUrl: './lc-page-loader.component.html',
  styleUrl: './lc-page-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LcPageLoaderComponent {
  /** When true, overlay and brand animation are shown. */
  readonly visible = input(false);

  /**
   * Announced to screen readers (no longer shown as body text).
   * @default 'Loading'
   */
  readonly message = input('Loading');

  /**
   * `contained` — fills the nearest `position: relative` ancestor (e.g. main content).
   * `fullscreen` — covers the entire viewport (e.g. blocking operations).
   */
  readonly mode = input<LcPageLoaderMode>('contained');

  /** Combined label for assistive tech, e.g. "Loading, LogiCare". */
  readonly ariaLabel = computed(() => `${this.message()}, LogiCare`);
}
