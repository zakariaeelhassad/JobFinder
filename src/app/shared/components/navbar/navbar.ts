import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  standalone: true,
})
export class Navbar {
  isMenuOpen = signal(false);

  constructor(
    public authService: Auth,
    private router: Router
  ) { }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isMenuOpen.set(false);
  }
}

