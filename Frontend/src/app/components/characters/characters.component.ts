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
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 40;
  selectedCharacter: any = null;

  constructor(
    private marvelService: MarvelService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.isLoading = true;
    this.marvelService.getCharacters(this.currentPage, this.itemsPerPage).subscribe(
      data => {
        if (data && data.data) {
          this.characters = data.data.results;
          this.totalPages = Math.ceil(data.data.total / this.itemsPerPage);
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error al cargar personajes:', error);
        this.isLoading = false;
      }
    );
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCharacters();
      window.scrollTo(0, 0);
    }
  }

  getPages(): number[] {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
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
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  showCharacterDetails(character: any): void {
    this.selectedCharacter = character;
  }

  closeModal(): void {
    this.selectedCharacter = null;
  }

  getSpanishDescription(description: string): string {
    // Aquí puedes implementar la lógica de traducción
    // Por ahora retornamos un mensaje genérico en español
    return description || 'Este personaje no tiene una descripción disponible.';
  }
}
