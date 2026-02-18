import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../../core/services/application/application';
import { Application } from '../../../core/models/application';
import { Auth } from '../../../core/services/auth/auth';

@Component({
    selector: 'app-applications-list',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './applications-list.html',
    standalone: true,
})
export class ApplicationsList implements OnInit {
    applications = signal<Application[]>([]);
    isLoading = signal(false);
    editingNotes: { [key: string]: boolean } = {};

    constructor(
        private applicationService: ApplicationService,
        private authService: Auth
    ) { }

    ngOnInit() {
        this.loadApplications();
    }

    loadApplications() {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.isLoading.set(true);
            this.applicationService.getApplications(user.id!).subscribe({
                next: (apps) => {
                    this.applications.set(apps);
                    this.isLoading.set(false);
                },
                error: () => {
                    this.isLoading.set(false);
                }
            });
        }
    }

    updateStatus(app: Application, status: 'en_attente' | 'accepte' | 'refuse') {
        if (app.id) {
            this.applicationService.updateApplication(app.id, { status }).subscribe({
                next: () => {
                    this.loadApplications();
                }
            });
        }
    }

    toggleEditNotes(appId: string) {
        this.editingNotes[appId] = !this.editingNotes[appId];
    }

    saveNotes(app: Application) {
        if (app.id) {
            this.applicationService.updateApplication(app.id, { notes: app.notes }).subscribe({
                next: () => {
                    this.editingNotes[app.id!] = false;
                }
            });
        }
    }

    deleteApplication(app: Application) {
        if (app.id && confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
            this.applicationService.deleteApplication(app.id).subscribe({
                next: () => {
                    this.loadApplications();
                }
            });
        }
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'en_attente': return 'bg-yellow-100 text-yellow-800';
            case 'accepte': return 'bg-green-100 text-green-800';
            case 'refuse': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'en_attente': return 'En attente';
            case 'accepte': return 'Accepté';
            case 'refuse': return 'Refusé';
            default: return status;
        }
    }

    getApplicationsByStatus(status: string): Application[] {
        return this.applications().filter(app => app.status === status);
    }
}
