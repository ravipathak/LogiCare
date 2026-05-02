import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type SetupStatCardVariant = 'locations' | 'contacts' | 'departments' | 'groups';

@Component({
  selector: 'app-setup-stat-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './setup-stat-card.component.html',
  styleUrl: './setup-stat-card.component.scss',
})
export class SetupStatCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: number | string;
  @Input({ required: true }) icon!: string;
  @Input() variant: SetupStatCardVariant = 'locations';
  /** Optional UI-only trend label (e.g. "+12") — not tied to data APIs. */
  @Input() trend?: string;
  @Input() active = false;
  @Output() cardClick = new EventEmitter<void>();

  onClick(): void {
    this.cardClick.emit();
  }
}
