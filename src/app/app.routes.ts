import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'admin/organization',
        loadComponent: () =>
          import('./pages/organization/organization.component').then(
            m => m.OrganizationComponent,
          ),
      },
      {
        path: 'admin/client-setup',
        loadComponent: () =>
          import('./pages/client-setup/client-setup.component').then(
            m => m.ClientSetupComponent,
          ),
      },
      {
        path: 'admin/schedule/create-standard',
        loadComponent: () =>
          import('./pages/schedule/create-standard-page.component').then(
            m => m.CreateStandardPageComponent,
          ),
      },
      {
        path: 'admin/schedule',
        loadComponent: () =>
          import('./pages/schedule/schedule.component').then(m => m.ScheduleComponent),
      },
      {
        path: 'admin/users/create',
        loadComponent: () =>
          import('./pages/users/create-user-page.component').then(m => m.CreateUserPageComponent),
      },
      {
        path: 'admin/users',
        loadComponent: () =>
          import('./pages/users/users-list.component').then(m => m.UsersListComponent),
      },
    ],
  },
];
