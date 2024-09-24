import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { CharactersComponent } from '../components/characters/characters.component';
import { FavoriteComponent } from '../components/favorite/favorite.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: AppComponent },
  { path: 'personajes', component: CharactersComponent },
  { path: 'favoritos', component: FavoriteComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class RoutingRoutingModule { }
