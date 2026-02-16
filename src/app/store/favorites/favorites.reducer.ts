import { createReducer, on } from '@ngrx/store';
import { FavoriteOffer } from '../../core/models/favorite-offer';
import * as FavoritesActions from './favorites.actions';

export interface FavoritesState {
    favorites: FavoriteOffer[];
    loading: boolean;
    error: any;
}

export const initialState: FavoritesState = {
    favorites: [],
    loading: false,
    error: null
};

export const favoritesReducer = createReducer(
    initialState,
    on(FavoritesActions.loadFavorites, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
        ...state,
        favorites,
        loading: false,
        error: null
    })),
    on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(FavoritesActions.addFavorite, (state) => ({
        ...state,
        loading: true
    })),
    on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({
        ...state,
        favorites: [...state.favorites, favorite],
        loading: false,
        error: null
    })),
    on(FavoritesActions.addFavoriteFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(FavoritesActions.removeFavorite, (state) => ({
        ...state,
        loading: true
    })),
    on(FavoritesActions.removeFavoriteSuccess, (state, { id }) => ({
        ...state,
        favorites: state.favorites.filter(f => f.id !== id),
        loading: false,
        error: null
    })),
    on(FavoritesActions.removeFavoriteFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);
