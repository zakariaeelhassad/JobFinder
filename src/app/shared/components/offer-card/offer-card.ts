import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer } from '../../../core/models/offer';
import { TruncatePipe } from '../../pipes/truncate-pipe';
import { DateAgoPipe } from '../../pipes/date-ago.pipe';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-offer-card',
  imports: [CommonModule, TruncatePipe, DateAgoPipe],
  templateUrl: './offer-card.html',
  standalone: true,
})
export class OfferCard {
  @Input() offer!: Offer;
  @Input() isFavorite: boolean = false;
  @Output() addToFavorites = new EventEmitter<Offer>();
  @Output() removeFromFavorites = new EventEmitter<Offer>();
  @Output() trackApplication = new EventEmitter<Offer>();

  constructor(public authService: Auth) { }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onAddToFavorites() {
    this.addToFavorites.emit(this.offer);
  }

  onRemoveFromFavorites() {
    this.removeFromFavorites.emit(this.offer);
  }

  onTrackApplication() {
    this.trackApplication.emit(this.offer);
  }

  formatSalary(): string {
    if (!this.offer.salary_min && !this.offer.salary_max) return 'Non spécifié';
    if (this.offer.salary_min && this.offer.salary_max) {
      return `£${this.offer.salary_min.toLocaleString()} - £${this.offer.salary_max.toLocaleString()}`;
    }
    if (this.offer.salary_min) return `À partir de £${this.offer.salary_min.toLocaleString()}`;
    return `Jusqu'à £${this.offer.salary_max!.toLocaleString()}`;
  }
}
