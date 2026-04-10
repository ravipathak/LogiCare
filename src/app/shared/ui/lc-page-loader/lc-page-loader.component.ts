import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type LcPageLoaderMode = 'contained' | 'fullscreen';

@Component({
  selector: 'lc-page-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './lc-page-loader.component.html',
  styleUrl: './lc-page-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LcPageLoaderComponent {
  /** When true, overlay and spinner are shown. */
  readonly visible = input(false);

  /** Shown under the spinner (keep short for accessibility). */
  readonly message = input('Loading…');

  /**
   * `contained` — fills the nearest `position: relative` ancestor (e.g. main content).
   * `fullscreen` — covers the entire viewport (e.g. blocking operations).
   */
  readonly mode = input<LcPageLoaderMode>('contained');
}
