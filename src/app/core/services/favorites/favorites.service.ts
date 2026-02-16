import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { FavoriteOffer } from '../../models/favorite-offer';
import { environment } from '../../../../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private apiUrl = `${environment.apiUrl}/favoritesOffers`;

    constructor(private http: HttpClient) { }

    getFavorites(userId: string): Observable<FavoriteOffer[]> {
        return this.http.get<FavoriteOffer[]>(`${this.apiUrl}?userId=${userId}`).pipe(
            catchError(error => {
                console.error('Error fetching favorites:', error);
                return of([]);
            })
        );
    }

    addFavorite(favorite: FavoriteOffer): Observable<FavoriteOffer> {
        return this.http.post<FavoriteOffer>(this.apiUrl, favorite);
    }

    removeFavorite(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    isFavorite(userId: string, offerId: string): Observable<boolean> {
        return this.http.get<FavoriteOffer[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`).pipe(
            map(favorites => favorites.length > 0),
            catchError(() => of(false))
        );
    }

    getFavoriteByOfferId(userId: string, offerId: string): Observable<FavoriteOffer | null> {
        return this.http.get<FavoriteOffer[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`).pipe(
            map(favorites => favorites.length > 0 ? favorites[0] : null),
            catchError(() => of(null))
        );
    }
}
