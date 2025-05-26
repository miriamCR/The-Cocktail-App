import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { CocktailService } from './services/cocktail.service';
import { slugify } from './utils/utils';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'The Cocktail App';

  constructor(private cocktailService: CocktailService, private router: Router) {}

  showRandomCocktail() {
    this.cocktailService.getRandomCocktail().subscribe(res => {
      const randomId = res.drinks[0].idDrink;
      const randomSlug = slugify(res.drinks[0].strDrink);
      if(randomId) {
        this.router.navigate(['/drink', randomId, randomSlug]);
      }
    });
  }
}
