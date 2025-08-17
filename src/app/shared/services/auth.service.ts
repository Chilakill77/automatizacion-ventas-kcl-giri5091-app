import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';
  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem(this.tokenKey)
  );
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Realiza login y guarda el token en localStorage.
   * Devuelve un observable que puedes suscribirte desde tu componente.
   */
  login(username: string, password: string): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(`${environment.API_URL}api/auth/auth/login`, { username, password })
      .pipe(
        tap(res => {
          localStorage.setItem(this.tokenKey, res.access_token);
          this.tokenSubject.next(res.access_token);
        })
      );
  }

  /**
   * Elimina token y actualiza el estado.
   */
  logout()  {
    localStorage.removeItem(this.tokenKey);
    this.tokenSubject.next(null);
  }

  /**
   * Obtiene token actual.
   */
  get token(): string | null {
    return localStorage.getItem(this.tokenKey);

  }

  /**
   * Indica si el usuario está logueado.
   */
  isLoggedIn(): boolean {
    return !!this.token;
  }
}
