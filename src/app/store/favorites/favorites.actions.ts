import { createAction, props } from '@ngrx/store';
import { FavoriteOffer } from '../../core/models/favorite-offer';

export const loadFavorites = createAction(
    '[Favorites] Load Favorites',
    props<{ userId: string }>()
);

export const loadFavoritesSuccess = createAction(
    '[Favorites] Load Favorites Success',
    props<{ favorites: FavoriteOffer[] }>()
);

export const loadFavoritesFailure = createAction(
    '[Favorites] Load Favorites Failure',
    props<{ error: any }>()
);

export const addFavorite = createAction(
    '[Favorites] Add Favorite',
    props<{ favorite: FavoriteOffer }>()
);

export const addFavoriteSuccess = createAction(
    '[Favorites] Add Favorite Success',
    props<{ favorite: FavoriteOffer }>()
);

export const addFavoriteFailure = createAction(
    '[Favorites] Add Favorite Failure',
    props<{ error: any }>()
);

export const removeFavorite = createAction(
    '[Favorites] Remove Favorite',
    props<{ id: string }>()
);

export const removeFavoriteSuccess = createAction(
    '[Favorites] Remove Favorite Success',
    props<{ id: string }>()
);

export const removeFavoriteFailure = createAction(
    '[Favorites] Remove Favorite Failure',
    props<{ error: any }>()
);
