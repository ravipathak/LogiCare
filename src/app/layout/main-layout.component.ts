import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
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
    MatTooltipModule,
    LcPageLoaderComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  /** Minimum time the route loader stays visible (cached lazy chunks can finish almost instantly otherwise). */
  private static readonly minRouteLoaderMs = 1000;

  private readonly breakpoint = inject(BreakpointObserver);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly pageLoader = inject(PageLoaderService);

  private readonly navStartTimes = new Map<number, number>();
  private readonly navHideTimeouts = new Map<number, ReturnType<typeof setTimeout>>();

  constructor() {
    const pageLoader = this.pageLoader;
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart) {
        pageLoader.show();
        this.navStartTimes.set(event.id, Date.now());
        return;
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        const id = event.id;
        const started = this.navStartTimes.get(id);
        this.navStartTimes.delete(id);

        const prev = this.navHideTimeouts.get(id);
        if (prev) {
          clearTimeout(prev);
        }

        const finish = (): void => {
          this.navHideTimeouts.delete(id);
          pageLoader.hide();
        };

        if (started === undefined) {
          finish();
          return;
        }

        const elapsed = Date.now() - started;
        const wait = Math.max(0, MainLayoutComponent.minRouteLoaderMs - elapsed);
        this.navHideTimeouts.set(id, setTimeout(finish, wait));
      }
    });

    inject(DestroyRef).onDestroy(() => {
      for (const t of this.navHideTimeouts.values()) {
        clearTimeout(t);
      }
      this.navHideTimeouts.clear();
      this.navStartTimes.clear();
      pageLoader.reset();
    });
  }

  readonly isHandset = toSignal(
    this.breakpoint.observe('(max-width: 959px)').pipe(map(r => r.matches)),
    { initialValue: false },
  );

  /** Left nav visible (desktop: push layout; mobile: overlay). */
  readonly sidebarOpen = signal(true);
  readonly adminExpanded = signal(true);

  /** App shell light/dark (header, sidebar, footer band). */
  readonly shellDark = signal(false);

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

  toggleShellDark(): void {
    this.shellDark.update(v => !v);
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
