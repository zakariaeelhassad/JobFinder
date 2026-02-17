import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  standalone: true,
})
export class Register {
  errorMessage: string = '';
  isLoading: boolean = false;
  registerForm;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value as any)
      .subscribe({
        next: (user) => {
          this.isLoading = false;

          if (!user) {
            this.errorMessage = 'Email déjà utilisé';
            return;
          }

          alert('Inscription réussie');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Erreur serveur. Réessayez.';
        }
      });
  }

  get f() {
    return this.registerForm.controls;
  }
}
