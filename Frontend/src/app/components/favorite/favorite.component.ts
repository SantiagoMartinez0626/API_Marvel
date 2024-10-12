import { Component, OnInit } from '@angular/core';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  favorites: any[] = [];
  isLoading: boolean = true;
  successMessage: string | null = null;

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  removeFavorite(characterId: number): void {
    console.log('Intentando eliminar favorito con ID:', characterId);
    this.favoriteService.removeFavorite(characterId).subscribe(
      () => {
        this.loadFavorites();
        this.showSuccessModal('Eliminado de favoritos correctamente');
      },
      (error) => {
        console.error('Error al eliminar el favorito', error);
        if (error.status === 404) {
          this.showSuccessModal('Personaje no encontrado en favoritos');
        } else {
          this.showSuccessModal('Error al eliminar el favorito');
        }
      }
    );
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.favoriteService.getFavorites().subscribe(
      data => {
        this.favorites = data;
        this.isLoading = false;
      },
      error => {
        console.error(error);
        this.isLoading = false;
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
