import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common'; // Para usar *ngIf, *ngFor, [ngSwitch]
import { RouterLink } from '@angular/router';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

import { CocktailService } from '../../services/cocktail.service';
import { IngredientsDialogComponent } from './ingredients-dialog/ingredients-dialog.component';
import { slugify } from '../../utils/utils';

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

//Funcion auxiliar para guardar los ingredients(name and measure)
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
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    RouterLink
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
  selectedIngredient: string = '';
  selectedAlcoholicType: string = '';
  letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  categories: string [] = [];
  ingredients: string [] = [];
  alcoholicTypes: string [] = [];

  // Drinks Count
  totalCount: number = 0;
  alcoholicCount: number = 0;
  nonAlcoholicCount: number = 0;
  optionalAlcoholCount: number = 0;

  constructor(private cocktailService: CocktailService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.searchByFirstLetter(this.selectedLetter);
    this.loadAllCategories();
    this.loadAllIngredients();
    this.loadAllAlcoholicTypes();
  }

  onSearchTypeChange(newType: string) {
    this.searchType = newType;
    this.dataSource.data = [];
    this.currentSearchMessage = '';
    
    if(newType === 'firstLetter') {
      this.searchByFirstLetter(this.selectedLetter);
    } else if(newType === 'category' && this.categories.length > 0) {
      this.searchByCategory(this.selectedCategory);
    } else if(newType === 'ingredient' && this.ingredients.length > 0) {
      this.searchByIngredient(this.selectedIngredient);
    } else if(newType === 'alcoholicType' && this.alcoholicTypes.length > 0) {
      this.searchByAlcoholicType(this.selectedAlcoholicType);
    }
  }

  updateSearchMessage(type: 'firstLetter' | 'category' | 'ingredient' |'alcoholicType' | 'cocktailName', value: string) {
    switch(type) {
      case 'firstLetter':
        this.currentSearchMessage = `Showing cocktails starting by "${value}"`;
        break;
      case 'category':
        this.currentSearchMessage = `Showing cocktails from the category "${value}"`;
        break;
      case 'ingredient':
        this.currentSearchMessage = `Showing cocktails containing the ingredient "${value}"`;
        break;
      case 'alcoholicType':
        if (value === 'Alcoholic') {
          this.currentSearchMessage = 'Showing alcoholic cocktails';
        } else if (value === 'Non alcoholic') {
          this.currentSearchMessage = 'Showing non-alcoholic cocktails';
        } else if (value === 'Optional alcohol') {
          this.currentSearchMessage = 'Showing cocktails with optional alcohol';
        } else {
          this.currentSearchMessage = `Showing cocktails (${value})`;
        }
        break;
      case 'cocktailName':
        this.currentSearchMessage = `Showing results for cocktails containing "${value}" in the name`;
        break;
    }
  }
  
  loadAllCategories() {
    this.cocktailService.getAllCategories().subscribe(res => {
      this.categories= res.drinks.map((c: any) => c.strCategory)
                                 .sort((a: string, b: string) => a.localeCompare(b));

      if(this.categories.length > 0 && !this.selectedCategory)
        this.selectedCategory = this.categories[0];
    });
  }

  loadAllIngredients() {
    this.cocktailService.getAllIngredients().subscribe(res => {
      this.ingredients= res.drinks.map((i: any) => i.strIngredient1)
                                  .sort((a: string, b: string) => a.localeCompare(b));

      if(this.ingredients.length > 0 && !this.selectedIngredient)
        this.selectedIngredient = this.ingredients[0];
    });
  }

  loadAllAlcoholicTypes() {
    this.cocktailService.getAllAlcoholicTypes().subscribe(res => {
      this.alcoholicTypes= res.drinks.map((alc: any) => alc.strAlcoholic)
                                     .sort((a: string, b: string) => a.localeCompare(b));

      if(this.alcoholicTypes.length > 0 && !this.selectedAlcoholicType)
        this.selectedAlcoholicType = this.alcoholicTypes[0];
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
    this.cocktailService.getCocktailsByCategory(category).subscribe(res => {
      this.updateSearchMessage('category', category);
      this.processData(res);
    });
  }

  searchByCocktailName(cocktailName: string) {
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

  searchByAlcoholicType(alcoholicType: string) {
    this.cocktailService.getCocktailsByAlcoholicType(alcoholicType).subscribe(res => {
      this.updateSearchMessage('alcoholicType', alcoholicType);
      this.processData(res);
    });
  }

  processData(res: any) {
    this.totalCount = 0;
    this.alcoholicCount = 0;
    this.nonAlcoholicCount = 0;
    this.optionalAlcoholCount = 0;

    if (!res.drinks || res.drinks === 'no data found') {
      console.log("processdata NODRINKS de homecomponent.ts");
      this.dataSource.data = [];
      return;
    }

    const processedCocktails = res.drinks.map((cocktail: any) => {
      this.totalCount++;
      if(cocktail.strAlcoholic === 'Alcoholic') {
        this.alcoholicCount++;
      } else if(cocktail.strAlcoholic === 'Non alcoholic') {
        this.nonAlcoholicCount++;
      } else if(cocktail.strAlcoholic === 'Optional alcohol') {
        this.optionalAlcoholCount++;
      }
      
    // Algunos endpoints solo devuelven id, nombre y thumb, otros más datos. Si no viene con ingredientes, no se pueden mostrar countIngredients correctamente
      const ingredients = extractIngredients(cocktail);
      return {
        ...cocktail, // Operador spread, copia todos los campos de cocktail
        ingredients, // Ya tiene el campo ingredients[] de la Interface lleno
        countIngredients: ingredients.length, // Ya tiene el campo countIngredients de la Interface lleno
      };
    });

    // Sort table data
    processedCocktails.sort((a: Cocktail, b: Cocktail) => a.strDrink.localeCompare(b.strDrink));
    this.dataSource.data = processedCocktails;
    console.log('(funcionPROCESSDATA)Lista de cócteles con ingredientes:', processedCocktails);
  }

  getSlug(name: string): string {
    return slugify(name);
  }
  
  openIngredientsModal(element: Cocktail): void {
    this.dialog.open(IngredientsDialogComponent, {
      data: element.ingredients, // Array (name and measure - without image)
    });
  }
}
