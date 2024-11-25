import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as md5 from 'md5';

@Injectable({
  providedIn: 'root'
})
export class MarvelService {
  private apiUrl = 'https://gateway.marvel.com/v1/public';
  private publicKey = '6af4ed04f947f505146e57186333de08';
  private privateKey = '2ae3b2441cfef13f0743060296ab58975ca5413d';

  constructor(private http: HttpClient) {}

  getCharacters(): Observable<any> {
    const timestamp = new Date().getTime().toString();
    const hash = this.generateHash(timestamp);

    const params = new HttpParams()
      .set('ts', timestamp)
      .set('apikey', this.publicKey)
      .set('hash', hash)
      .set('limit', '100')
      .set('offset', '0');

    return this.http.get<any>(`${this.apiUrl}/characters`, {
      params: params
    });
  }

  private generateHash(timestamp: string): string {
    const stringToHash = timestamp + this.privateKey + this.publicKey;
    console.log('String para hash:', stringToHash);
    return md5(stringToHash);
  }
}
