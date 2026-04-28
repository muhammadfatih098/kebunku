import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabs/tabs.component').then(m => m.TabsComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./pages/favorites/favorites.page').then(m => m.FavoritesPage)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'plant/:id',
    loadComponent: () => import('./pages/detail/detail.page').then(m => m.DetailPage)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
