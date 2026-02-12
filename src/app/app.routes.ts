import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'jobs',
    loadComponent: () => import('./features/offer/offer-list/offer-list').then(m => m.OfferList)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites-list/favorites-list').then(m => m.FavoritesList),
    canActivate: [authGuard]
  },
  {
    path: 'applications',
    loadComponent: () => import('./features/applications/applications-list/applications-list').then(m => m.ApplicationsList),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
