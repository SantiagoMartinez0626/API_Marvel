import { Component, OnInit } from '@angular/core';
import { MarvelService } from 'src/app/services/marvel.service';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {

  characters: any[] = [];

  constructor(
    private marvelService: MarvelService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.marvelService.getCharacters().subscribe(data => {
      this.characters = data.data.results;
    });
  }

  addToFavorites(character: any): void {
    this.favoriteService.addFavorite(character).subscribe(
      (response) => {
        console.log('Personaje añadido a favoritos', response);
      },
      (error) => {
        if (error.status === 409) {
          console.log('El personaje ya se encuentra en favoritos');
        }
      }
    );
  }
}
