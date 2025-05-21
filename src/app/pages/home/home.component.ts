import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngIf, *ngFor, [ngSwitch]

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

import { CocktailService } from '../../services/cocktail.service';

export interface Ingredient {
  strIngredient: string;
  strMeasure: string;
}

export interface Cocktail {
  idDrink: string;
  strDrinkThumb: string;
  strDrink: string;
  strCategory: string;
  strAlcoholic: string;
  ingredients: Ingredient[]; //Calcular
  countIngredients: number; // Calcular
  dateModified?: string; // Opcional porque puede faltar 
}

//Funcion auxiliar para guardar los ingredientes(nombre y medida)
function extractIngredients(cocktail: any): Ingredient[]{
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 15; i++) {
    const name = cocktail[`strIngredient${i}`];
    if (name && name.trim() !=='') {
      const measure = cocktail[`strMeasure${i}`];
      ingredients.push({strIngredient: name,strMeasure: measure});
    }
  }
  return ingredients;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['idDrink', 'strDrinkThumb', 'strDrink', 'strCategory',
                                'strAlcoholic', 'countIngredients', 'dateModified'];
  dataSource = new MatTableDataSource<Cocktail>([]);

  currentSearchMessage: string = '';
  searchType: string = 'firstLetter';
  selectedLetter: string = 'A';
  selectedCategory: string = '';
  letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  categories: string [] = [];

  constructor(private cocktailService: CocktailService) { }

  ngOnInit(): void {
    this.searchByFirstLetter(this.selectedLetter);
    this.loadCategories();
  }

  onSearchTypeChange(newType: string) {
    this.searchType = newType;
    this.dataSource.data = [];
    this.currentSearchMessage = '';
    
    if(newType === 'firstLetter') {
      this.searchByFirstLetter(this.selectedLetter);
    } else if(newType === 'category' && this.categories.length > 0) {
      this.searchByCategory(this.selectedCategory);
    }
  }

  updateSearchMessage(type: 'firstLetter' | 'category' | 'cocktailName' | 'ingredient', value: string) {
    switch(type) {
      case 'firstLetter':
        this.currentSearchMessage = `Showing cocktails starting by "${value}"`;
        break;
      case 'category':
        this.currentSearchMessage = `Showing cocktails from the category "${value}"`;
        break;
      case 'cocktailName':
        this.currentSearchMessage = `Showing results for cocktails containing "${value}" in the name`;
        break;
      case 'ingredient':
        this.currentSearchMessage = `Showing cocktails containing the ingredient "${value}"`;
        break;
    }
  }
  
  loadCategories() {
    this.cocktailService.getCategories().subscribe(res => {
      this.categories= res.drinks.map((c: any) => c.strCategory);
      if(this.categories.length > 0 && !this.selectedCategory)
        this.selectedCategory = this.categories[0];
    });
  }

  searchByFirstLetter(firstLetter: string) {
    this.selectedLetter = firstLetter;
    this.cocktailService.getCocktailsByFirstLetter(firstLetter).subscribe(res => {
      this.updateSearchMessage('firstLetter', firstLetter);
      this.processData(res);
    });
  }

  searchByCategory(category: string) {
    this.selectedCategory = category;
    this.cocktailService.getCocktailsByCategory(category).subscribe(res => {
      this.updateSearchMessage('category', category);
      this.processData(res);
    });
  }

  searchByCocktailName(cocktailName: string) {
    console.log("searchbycocktailname en homecomponent.ts")
    this.cocktailService.getCocktailsByCocktailName(cocktailName).subscribe(res => {
      this.updateSearchMessage('cocktailName', cocktailName);
      this.processData(res);
    });
  }

  searchByIngredient(ingredient: string) {
    this.cocktailService.getCocktailsByIngredient(ingredient).subscribe(res => {
      this.updateSearchMessage('ingredient', ingredient);
      this.processData(res);
    });
  }

  processData(res: any) {
    if (!res.drinks) {
    console.log("processdata NODRINKS de homecomponent.ts");
      this.dataSource.data = [];
      return;
    }

    // Algunos endpoints solo devuelven id, nombre y thumb, otros más datos. Si no viene con ingredientes, no se pueden mostrar countIngredients correctamente
    const processedCocktails = res.drinks.map((cocktail: any) => {
      const ingredients = extractIngredients(cocktail);
      return {
        ...cocktail, // Operador spread, copia todos los campos de cocktail
        ingredients, // Ya tiene el campo ingredients[] de la Interface lleno
        countIngredients: ingredients.length, // Ya tiene el campo countIngredients de la Interface lleno
      };
    });

    this.dataSource.data = processedCocktails;
    console.log('(funcionPROCESSDATA)Lista de cócteles con ingredientes:', processedCocktails);
  }

}
