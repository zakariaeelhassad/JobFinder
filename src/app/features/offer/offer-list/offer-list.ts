import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { OfferService, SearchFilters } from '../../../core/services/offer/offer';
import { FavoritesService } from '../../../core/services/favorites/favorites.service';
import { ApplicationService } from '../../../core/services/application/application';
import { Auth } from '../../../core/services/auth/auth';
import { Offer } from '../../../core/models/offer';
import { FavoriteOffer } from '../../../core/models/favorite-offer';
import { Application } from '../../../core/models/application';
import { OfferCard } from '../../../shared/components/offer-card/offer-card';
import * as FavoritesActions from '../../../store/favorites/favorites.actions';
import { selectAllFavorites } from '../../../store/favorites/favorites.selectors';

@Component({
  selector: 'app-offer-list',
  imports: [CommonModule, ReactiveFormsModule, OfferCard],
  templateUrl: './offer-list.html',
  standalone: true,
})
export class OfferList implements OnInit {
  offers = signal<Offer[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  currentPage = signal(1);
  totalResults = signal(0);
  resultsPerPage = 10;
  favoriteOfferIds = signal<string[]>([]);
  searchForm;

  constructor(
    private fb: FormBuilder,
    private offerService: OfferService,
    private favoritesService: FavoritesService,
    private applicationService: ApplicationService,
    private authService: Auth,
    private store: Store
  ) {
    this.searchForm = this.fb.group({
      keyword: ['developer', Validators.required],
      location: ['london', Validators.required],
      contractType: [''],
      salaryMin: ['']
    });
  }

  ngOnInit() {
    this.loadFavorites();
    this.searchJobs();
  }

  loadFavorites() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id! }));
      this.store.select(selectAllFavorites).subscribe(favorites => {
        this.favoriteOfferIds.set(favorites.map(f => f.offerId));
      });
    }
  }

  searchJobs() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const filters: SearchFilters = {
      keyword: this.searchForm.value.keyword!,
      location: this.searchForm.value.location!,
      contractType: this.searchForm.value.contractType || undefined,
      salaryMin: this.searchForm.value.salaryMin ? Number(this.searchForm.value.salaryMin) : undefined,
      page: this.currentPage(),
      resultsPerPage: this.resultsPerPage
    };

    this.offerService.searchJobs(filters).subscribe({
      next: (response) => {
        this.offers.set(response.results);
        this.totalResults.set(response.count);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Erreur lors de la recherche. Veuillez réessayer.');
        this.isLoading.set(false);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.searchJobs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalPages(): number {
    return Math.ceil(this.totalResults() / this.resultsPerPage);
  }

  isFavorite(offerId: string): boolean {
    return this.favoriteOfferIds().includes(offerId);
  }

  addToFavorites(offer: Offer) {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const favorite: FavoriteOffer = {
      userId: user.id!,
      offerId: offer.id,
      title: offer.title,
      company: offer.company.display_name,
      location: offer.location.display_name,
      description: offer.description,
      url: offer.redirect_url,
      salary_min: offer.salary_min,
      salary_max: offer.salary_max,
      created: offer.created,
      dateAdded: new Date().toISOString()
    };

    this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
  }

  removeFromFavorites(offer: Offer) {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.favoritesService.getFavoriteByOfferId(user.id!, offer.id).subscribe(favorite => {
      if (favorite && favorite.id) {
        this.store.dispatch(FavoritesActions.removeFavorite({ id: favorite.id }));
      }
    });
  }

  trackApplication(offer: Offer) {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const application: Application = {
      userId: user.id!,
      offerId: offer.id,
      apiSource: 'adzuna',
      title: offer.title,
      company: offer.company.display_name,
      location: offer.location.display_name,
      url: offer.redirect_url,
      status: 'en_attente',
      notes: '',
      dateAdded: new Date().toISOString()
    };

    this.applicationService.addApplication(application).subscribe({
      next: () => {
        alert('Candidature ajoutée au suivi !');
      },
      error: () => {
        alert('Erreur lors de l\'ajout de la candidature');
      }
    });
  }
}
