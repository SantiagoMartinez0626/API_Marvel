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
  isLoading: boolean = true;
  successMessage: string | null = null;

  constructor(
    private marvelService: MarvelService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.isLoading = true;
    this.marvelService.getCharacters().subscribe(
      data => {
        this.characters = data.data.results;
        this.isLoading = false;
      },
      error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  addToFavorites(character: any): void {
    console.log('Añadiendo favorito:', character);
    this.favoriteService.addFavorite(character).subscribe(
      (response) => {
        console.log('Personaje añadido a favoritos', response);
        this.showSuccessModal('Agregado a favoritos correctamente');
      },
      (error) => {
        if (error.status === 409) {
          console.log('El personaje ya se encuentra en favoritos');
          this.showSuccessModal('El personaje ya está en favoritos');
        } else {
          console.error('Error al agregar a favoritos', error);
          this.showSuccessModal('Error al agregar a favoritos');
        }
      }
    );
  }

  showSuccessModal(message: string): void {
    this.successMessage = message;
  }

  closeModal(): void {
    this.successMessage = null;
  }
}
