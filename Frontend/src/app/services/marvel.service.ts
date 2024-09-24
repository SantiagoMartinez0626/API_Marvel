import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as md5 from 'md5';

@Injectable({
  providedIn: 'root'
})
export class MarvelService {
  private apiUrl = 'https://gateway.marvel.com/v1/public/characters';
  private publicKey = '6af4ed04f947f505146e57186333de08';
  private privateKey = '2ae3b2441cfef13f0743060296ab58975ca5413d';

  constructor(private http: HttpClient) {}

  getCharacters(): Observable<any> {
    const ts = new Date().getTime();
    const hash = md5(ts + this.privateKey + this.publicKey);
    const url = `${this.apiUrl}?ts=${ts}&apikey=${this.publicKey}&hash=${hash}`;

    return this.http.get<any>(url);
  }
}
