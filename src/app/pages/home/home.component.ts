import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // To use *ngIf, *ngFor, [ngSwitch]
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { CocktailService } from '../../services/cocktail.service';
import { IngredientsDialogComponent } from './ingredients-dialog/ingredients-dialog.component';
import { slugify } from '../../utils/utils';
import { catchError, forkJoin, of } from 'rxjs';

export interface Ingredient {
  strIngredient: string;
  strMeasure: string | null;
}

export interface Cocktail {
  idDrink: string;
  strDrinkThumb: string;
  strDrink: string;
  strCategory: string;
  strAlcoholic: string;
  ingredients: Ingredient[];
  countIngredients: number;
  dateModified: string | null;
}

// Save the ingredients (name and measure)
function extractIngredients(cocktail: any): Ingredient[]{
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 15; i++) {
    const name = cocktail[`strIngredient${i}`];
    if (name && name.trim() !=='') {
      const measure = cocktail[`strMeasure${i}`];
      ingredients.push({ strIngredient: name, strMeasure: measure });
    }
  }
  return ingredients;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['idDrink', 'strDrinkThumb', 'strDrink', 'strCategory',
                                'strAlcoholic', 'countIngredients', 'dateModified'];
  dataSource = new MatTableDataSource<Cocktail>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  currentSearchMessage: string = '';
  searchType: string = 'firstLetter';
  selectedLetter: string = 'A';
  selectedCategory: string = '';
  selectedIngredient: string = '';
  letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  categories: string [] = [];
  ingredients: string [] = [];
  alcoholicTypes: string [] = [];

  // Drinks Count
  totalCount: number = 0;
  alcoholicCount: number = 0;
  nonAlcoholicCount: number = 0;
  optionalAlcoholCount: number = 0;

  isLoading: boolean = true;
  firstSearchCocktailName: boolean = true;

  failedIdsCount: number = 0;

  constructor(private cocktailService: CocktailService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.searchByFirstLetter(this.selectedLetter);
    this.loadAllCategories();
    this.loadAllIngredients();
    this.loadAllAlcoholicTypes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
    } else if(newType === 'cocktailName') {
      this.firstSearchCocktailName = true;
      this.searchByCocktailName("");
    }
  }

  updateSearchMessage(type: 'firstLetter' | 'category' | 'ingredient' | 'cocktailName', value: string) {
    switch(type) {
      case 'firstLetter':
        this.currentSearchMessage = `Showing cocktails starting by "${value}" (${this.totalCount} results)`;
        break;
      case 'category':
        this.currentSearchMessage = `Showing cocktails from the category "${value}" (${this.totalCount} results)`;
        break;
      case 'ingredient':
        this.currentSearchMessage = `Showing cocktails containing the ingredient "${value}"(${this.totalCount} results)`;
        break;
      case 'cocktailName':
        this.currentSearchMessage = `Showing results for cocktails containing "${value}" in the name (${this.totalCount} results)`;
        break;
    }
  }
  
  loadAllCategories() {
    this.cocktailService.getAllCategories().subscribe(res => {
      this.categories = res.drinks.map((c: any) => c.strCategory)
                                  .sort((a: string, b: string) => a.localeCompare(b));

      if (this.categories.length > 0 && !this.selectedCategory)
        this.selectedCategory = this.categories[0];
    });
  }

  loadAllIngredients() {
    this.cocktailService.getAllIngredients().subscribe(res => {
      this.ingredients = res.drinks.map((i: any) => i.strIngredient1)
                                   .sort((a: string, b: string) => a.localeCompare(b));

      if (this.ingredients.length > 0 && !this.selectedIngredient)
        this.selectedIngredient = this.ingredients[0];
    });
  }

  loadAllAlcoholicTypes() {
    this.cocktailService.getAllAlcoholicTypes().subscribe(res => {
      this.alcoholicTypes = res.drinks.map((alc: any) => alc.strAlcoholic)
                                      .sort((a: string, b: string) => a.localeCompare(b));
    });
  }

  searchByFirstLetter(firstLetter: string) {
    this.isLoading = true;
    this.selectedLetter = firstLetter;
    this.cocktailService.getCocktailsByFirstLetter(firstLetter).subscribe(res => {
      this.processData(res);
      this.updateSearchMessage('firstLetter', firstLetter);
      this.isLoading = false;
    });
  }

  searchByCategory(category: string) {
    this.isLoading = true;
    this.failedIdsCount = 0;
    this.cocktailService.getCocktailsByCategory(category).subscribe(res => {
      const ids = res.drinks.map((cocktail: Cocktail) => cocktail.idDrink);
      const requests = ids.map((id: string) =>
        this.cocktailService.getFullCocktailDetailsById(id).pipe(
          catchError(err => {
            this.failedIdsCount++;
            return of(null);
          })
        )
      );

      forkJoin(requests).subscribe((results: any) => {
        console.log('Todos los resultados de la API (category):', results); // Raw results from API

        const validResults = results.filter((r: any) => r != null);
        const drinks = validResults.map( (r: any) => r.drinks).flat();
        console.log('Resultados validos aplanados:', drinks); // Valid results

        this.processData({ drinks });
        this.updateSearchMessage('category', category);
        this.isLoading = false;
      });
    });
  }

  searchByIngredient(ingredient: string) {
    this.isLoading = true;
    this.failedIdsCount = 0;
    this.cocktailService.getCocktailsByIngredient(ingredient).subscribe(res => {
      const ids = res.drinks.map((cocktail: Cocktail) => cocktail.idDrink);
      const requests = ids.map((id: string) =>
        this.cocktailService.getFullCocktailDetailsById(id).pipe(
          catchError(err => {
            this.failedIdsCount++;
            return of(null);
          })
        )
      );

      forkJoin(requests).subscribe((results: any) => {
        const validResults = results.filter((r: any) => r != null);
        const drinks = validResults.map( (r: any) => r.drinks).flat();

        this.processData({ drinks });
        this.updateSearchMessage('ingredient', ingredient);
        this.isLoading = false;
      });
    });
  }

  searchByCocktailName(cocktailName: string) {
    this.isLoading = true;
    this.cocktailService.getCocktailsByCocktailName(cocktailName).subscribe(res => {
      this.processData(res);
      if (!this.firstSearchCocktailName) {
        this.updateSearchMessage('cocktailName', cocktailName);
      }
      this.isLoading = false;
      this.firstSearchCocktailName = false;
    });
  }

  processData(res: any) {
    this.totalCount = 0;
    this.alcoholicCount = 0;
    this.nonAlcoholicCount = 0;
    this.optionalAlcoholCount = 0;

    if (!res.drinks || res.drinks === 'no data found') {
      console.log("ProcessData() -> NO DRINKS");
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
      
      const ingredients = extractIngredients(cocktail);
      return {
        ...cocktail, // Spread operator
        ingredients,
        countIngredients: ingredients.length,
      };
    });

    // Sort table data
    processedCocktails.sort((a: Cocktail, b: Cocktail) => a.strDrink.localeCompare(b.strDrink));
    this.isLoading  = true;
    this.dataSource.data = processedCocktails;
    this.paginator.firstPage(); // Reset the paginator to the first page
  }

  getSlug(name: string): string {
    return slugify(name);
  }
  
  openIngredientsModal(element: Cocktail): void {
    this.dialog.open(IngredientsDialogComponent, {
      data: element.ingredients, // Array (name and measure - without image)
    });
  }
  
  goToAlcoholType(type: string) {
    this.router.navigate(['/alcohol-type', type]);
  }
}
