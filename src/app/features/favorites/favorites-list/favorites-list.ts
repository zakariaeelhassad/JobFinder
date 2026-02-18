import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { OfferCard } from '../../../shared/components/offer-card/offer-card';
import { FavoriteOffer } from '../../../core/models/favorite-offer';
import { Auth } from '../../../core/services/auth/auth';
import * as FavoritesActions from '../../../store/favorites/favorites.actions';
import { selectAllFavorites, selectFavoritesLoading } from '../../../store/favorites/favorites.selectors';

@Component({
  selector: 'app-favorites-list',
  imports: [CommonModule, OfferCard, RouterLink],
  templateUrl: './favorites-list.html',
  standalone: true,
})
export class FavoritesList implements OnInit {
  favorites = signal<FavoriteOffer[]>([]);
  isLoading = signal(false);

  constructor(
    private store: Store,
    private authService: Auth
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id! }));

      this.store.select(selectAllFavorites).subscribe(favorites => {
        this.favorites.set(favorites);
      });

      this.store.select(selectFavoritesLoading).subscribe(loading => {
        this.isLoading.set(loading);
      });
    }
  }

  removeFavorite(favorite: FavoriteOffer) {
    if (favorite.id) {
      this.store.dispatch(FavoritesActions.removeFavorite({ id: favorite.id }));
    }
  }

  convertToOffer(favorite: FavoriteOffer): any {
    return {
      id: favorite.offerId,
      title: favorite.title,
      company: { display_name: favorite.company },
      location: { display_name: favorite.location },
      description: favorite.description,
      created: favorite.created,
      redirect_url: favorite.url,
      salary_min: favorite.salary_min,
      salary_max: favorite.salary_max
    };
  }
}
