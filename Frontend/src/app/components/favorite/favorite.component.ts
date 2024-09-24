import { Component, OnInit } from '@angular/core';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  favorites: any[] = [];

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.favoriteService.getFavorites().subscribe(data => {
      this.favorites = data;
    });
  }

  removeFavorite(characterId: string): void {
    this.favoriteService.removeFavorite(characterId).subscribe(() => {
      this.favorites = this.favorites.filter(fav => fav.characterId !== characterId);
    });
  }

}
