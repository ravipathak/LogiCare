import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly breakpoint = inject(BreakpointObserver);

  readonly isHandset = toSignal(
    this.breakpoint.observe('(max-width: 959px)').pipe(map(r => r.matches)),
    { initialValue: false },
  );

  /** Left nav visible (desktop: push layout; mobile: overlay). */
  readonly sidebarOpen = signal(true);
  readonly adminExpanded = signal(true);

  readonly userName = 'Ravi Pathak';
  readonly shortName = 'Ravi';

  toggleSidenav(): void {
    this.sidebarOpen.update(v => !v);
  }

  onSidenavOpenedChange(open: boolean): void {
    this.sidebarOpen.set(open);
  }

  toggleAdmin(): void {
    this.adminExpanded.update(v => !v);
  }

  closeMobileMenu(): void {
    if (this.isHandset()) {
      this.sidebarOpen.set(false);
    }
  }
}
