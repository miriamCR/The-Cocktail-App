import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CocktailService } from '../../services/cocktail.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-drink-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './drink-detail.component.html',
  styleUrl: './drink-detail.component.scss'
})
export class DrinkDetailComponent implements OnInit {
  drink: any;
  selectedLanguage: string = 'EN';
  availableLanguages: string[] = [];

  constructor(private route: ActivatedRoute, private cocktailService: CocktailService) {}

  ngOnInit(): void {
    this.route.paramMap // Listen for route changes
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          if (id) {
            return this.cocktailService.getFullCocktailDetailsById(id);
          }
          return [];
        })
      )
      .subscribe((res: any) => {
        if (res && res.drinks && res.drinks.length > 0) {
          this.drink = res.drinks[0];
          this.availableLanguages = this.getAvailableLanguages(this.drink);
          this.selectedLanguage = 'EN';
        }
      });
  }

  getIngredients(drink: any): any[] {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push({ ingredient, measure });
      }
    }
    return ingredients;
  }

  getAvailableLanguages(drink: any): string[] {
    return ['EN', 'ES', 'DE', 'FR', 'IT'].filter(language => {
      if (language === 'EN')
        return drink['strInstructions'];
      else
        return drink[`strInstructions${language}`];
    });
  }

  getInstructionsByLanguage(language: string): string {
    if (!this.drink) return '';

    if (language === 'EN')
      return this.drink.strInstructions;
    else
      return this.drink[`strInstructions${language}`] || 'No instructions available';
  }

  changeLanguage(language: string): void {
    this.selectedLanguage = language;
  }
}
