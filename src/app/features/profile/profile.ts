import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
import { User } from '../../core/models/user';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './profile.html'
})
export class Profile implements OnInit {
    profileForm: FormGroup;
    isEditing = signal(false);
    successMessage = signal('');
    errorMessage = signal('');
    currentUser: User | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: Auth,
        private router: Router
    ) {
        this.profileForm = this.fb.group({
            nom: [{ value: '', disabled: true }, Validators.required],
            prenom: [{ value: '', disabled: true }, Validators.required],
            email: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
        });
    }

    ngOnInit() {
        this.currentUser = this.authService.getCurrentUser();
        if (this.currentUser) {
            this.profileForm.patchValue({
                nom: this.currentUser.nom,
                prenom: this.currentUser.prenom,
                email: this.currentUser.email
            });
        } else {
            this.router.navigate(['/login']);
        }
    }

    toggleEdit() {
        this.isEditing.update(value => !value);
        if (this.isEditing()) {
            this.profileForm.enable();
        } else {
            this.profileForm.disable();
            if (this.currentUser) {
                this.profileForm.patchValue({
                    nom: this.currentUser.nom,
                    prenom: this.currentUser.prenom,
                    email: this.currentUser.email
                });
            }
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    deleteAccount() {
        if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
            if (this.currentUser && this.currentUser.id) {
                this.authService.deleteAccount(this.currentUser.id).subscribe({
                    next: () => {
                        this.router.navigate(['/login']);
                    },
                    error: (err) => {
                        this.errorMessage.set('Erreur lors de la suppression du compte.');
                        console.error(err);
                    }
                });
            }
        }
    }

    onSubmit() {
        if (this.profileForm.valid && this.currentUser) {
            const updatedUser: User = {
                ...this.currentUser,
                ...this.profileForm.value
            };

            this.authService.updateProfile(updatedUser).subscribe({
                next: (user) => {
                    this.currentUser = user;
                    this.successMessage.set('Profil mis à jour avec succès.');
                    this.isEditing.set(false);
                    this.profileForm.disable();
                    setTimeout(() => this.successMessage.set(''), 3000);
                },
                error: (err) => {
                    this.errorMessage.set('Erreur lors de la mise à jour du profil.');
                    console.error(err);
                    setTimeout(() => this.errorMessage.set(''), 3000);
                }
            });
        }
    }
}
