import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = environment.apiUrl + '/favorites';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addFavorite(character: any): Observable<any> {
    return this.http.post(this.apiUrl, character);
  }

  removeFavorite(characterId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${characterId}`);
  }
}
