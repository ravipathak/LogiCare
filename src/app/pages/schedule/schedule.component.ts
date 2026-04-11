import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { map } from 'rxjs';

import { PageLoaderService } from '../../services/page-loader.service';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleAssetsTabComponent } from './tabs/schedule-assets-tab.component';
import { ScheduleStandardsTabComponent } from './tabs/schedule-standards-tab.component';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTabsModule,
    MatIconModule,
    ScheduleStandardsTabComponent,
    ScheduleAssetsTabComponent,
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  private readonly scheduleService = inject(ScheduleService);
  private readonly pageLoader = inject(PageLoaderService);

  /** 0 = Standards, 1 = Assets */
  selectedTabIndex = 0;

  readonly standardsCount$ = this.scheduleService.getStandards().pipe(map(rows => rows.length));

  readonly assetsCount$ = this.scheduleService.getAssets().pipe(map(rows => rows.length));

  onTabSelected(index: number): void {
    if (this.selectedTabIndex === index) {
      return;
    }
    this.selectedTabIndex = index;
    this.pageLoader.flash(1100);
  }
}
