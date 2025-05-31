import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CocktailService } from '../../services/cocktail.service';
import { Cocktail } from '../home/home.component';
import { slugify } from '../../utils/utils';

@Component({
  selector: 'app-alcohol-type-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './alcohol-type-list.component.html',
  styleUrls: ['./alcohol-type-list.component.scss']
})
export class AlcoholTypeListComponent implements OnInit {
  alcoholicType: string = '';
  cocktails: Cocktail[] = [];
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private cocktailService: CocktailService) {}

  ngOnInit(): void {
    this.alcoholicType = this.route.snapshot.paramMap.get('type') || '';
    if (this.alcoholicType) {
      this.loading = true;
      this.cocktailService.getCocktailsByAlcoholicType(this.alcoholicType).subscribe({
        next: (res) => {
          this.cocktails = res.drinks || [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar cócteles:', error);
          this.cocktails = [];
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  getSlug(name: string): string {
    return slugify(name);
  }
}
