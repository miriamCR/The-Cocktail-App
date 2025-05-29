import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngIf, *ngFor, [ngSwitch]
import { ActivatedRoute} from '@angular/router';
import { CocktailService } from '../../services/cocktail.service';

@Component({
  selector: 'app-drink-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drink-detail.component.html',
  styleUrl: './drink-detail.component.scss'
})
export class DrinkDetailComponent implements OnInit {
  drink: any;

  constructor(private route: ActivatedRoute, private cocktailService: CocktailService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cocktailService.getFullCocktailDetailsById(id).subscribe((res) => {
        this.drink = res.drinks[0];
      });
    }
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
}
