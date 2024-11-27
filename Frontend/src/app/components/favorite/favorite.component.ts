import { Component, OnInit } from '@angular/core';
import { FavoriteService } from 'src/app/services/favorite.service';
import jsPDF from 'jspdf';
import { utils as XLSXUtils, writeFile } from 'xlsx';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  favorites: any[] = [];
  isLoading: boolean = true;
  successMessage: string | null = null;
  selectedCharacter: any = null;

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
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Título
    doc.setFontSize(20);
    doc.text('Mis Personajes Favoritos de Marvel', pageWidth/2, yPosition, { align: 'center' });
    yPosition += 20;

    // Configuración de la tabla
    const imageSize = 30;
    const margin = 20;
    const colWidth = (pageWidth - 2 * margin) / 2;

    this.favorites.forEach((favorite, index) => {
      if (yPosition >= 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Cargar y agregar imagen
      const img = new Image();
      img.src = `${favorite.thumbnail.path}.${favorite.thumbnail.extension}`;
      doc.addImage(img, 'JPEG', margin, yPosition, imageSize, imageSize);

      // Agregar nombre
      doc.setFontSize(12);
      doc.text(favorite.name, margin + imageSize + 10, yPosition + imageSize/2);

      yPosition += imageSize + 10;
    });

    doc.save('mis-favoritos-marvel.pdf');
    this.showSuccessModal('PDF exportado correctamente');
  }

  exportToExcel(): void {
    const data = this.favorites.map(favorite => ({
      Nombre: favorite.name,
      'URL de Imagen': `${favorite.thumbnail.path}.${favorite.thumbnail.extension}`
    }));

    const ws = XLSXUtils.json_to_sheet(data);
    const wb = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(wb, ws, 'Favoritos');
    writeFile(wb, 'mis-favoritos-marvel.xlsx');
    
    this.showSuccessModal('Excel exportado correctamente');
  }

  showCharacterDetails(character: any): void {
    this.selectedCharacter = character;
    console.log('Descripción del personaje:', character.description);
  }

  closeModal(): void {
    this.selectedCharacter = null;
  }

  getSpanishDescription(description: string): string {
    // Aquí puedes implementar una lógica de traducción más elaborada
    const translations: { [key: string]: string } = {
      "Rick Jones has been Hulk's best bud": "Rick Jones ha sido el mejor amigo de Hulk",
      "transformed": "transformado",
      "energy explosion": "explosión de energía",
      "friend": "amigo",
      "teammate": "compañero de equipo"
    };

    if (!description) return 'No hay descripción disponible para este personaje';

    let spanishText = description;
    Object.keys(translations).forEach(englishWord => {
      const regex = new RegExp(englishWord, 'gi');
      spanishText = spanishText.replace(regex, translations[englishWord]);
    });

    return spanishText;
  }
}
