import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  scanMode: 'asset' | 'standard' = 'asset';

  readonly tiles = [
    { label: 'Calibration', icon: 'speed' },
    { label: 'Validation', icon: 'fact_check' },
    { label: 'Preventive Maintenance', icon: 'handyman' },
    { label: 'GxP Metric', icon: 'bar_chart' },
    { label: 'PEC', icon: 'description' },
    { label: 'HEPA', icon: 'filter_alt' },
  ] as const;
}
