import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
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
    ],
  },
];
