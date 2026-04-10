import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PageLoaderService } from '../services/page-loader.service';
import { LcPageLoaderComponent } from '../shared/ui/lc-page-loader/lc-page-loader.component';

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
    LcPageLoaderComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly breakpoint = inject(BreakpointObserver);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly pageLoader = inject(PageLoaderService);

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

  signOut(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
