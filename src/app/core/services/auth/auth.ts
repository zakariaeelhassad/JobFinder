import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      timeout(5000)
    );
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map(users => {
          if (users.length > 0) {
            const user = users[0];
            const { password: _, ...userWithoutPassword } = user;

            sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
            return userWithoutPassword as User;
          }
          return null;
        })
      );
  }

  logout() {
    sessionStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('user');
  }

  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      map(updatedUser => {
        const { password, ...userWithoutPassword } = updatedUser;
        sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return userWithoutPassword as User;
      })
    );
  }

  deleteAccount(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
      map(() => {
        this.logout();
      })
    );
  }
}
