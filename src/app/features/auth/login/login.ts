import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  standalone: true,
})
export class Login {
  errorMessage: string = '';
  isLoading: boolean = false;
  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!)
      .subscribe({
        next: (user) => {
          this.isLoading = false;

          if (user) {
            this.router.navigate(['/']);
          } else {
            this.errorMessage = 'Email ou mot de passe incorrect';
          }
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Erreur serveur. Réessayez.';
        }
      });
  }

  get f() {
    return this.loginForm.controls;
  }
}
