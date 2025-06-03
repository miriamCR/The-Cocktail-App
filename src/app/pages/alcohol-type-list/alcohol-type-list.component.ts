import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import { CocktailService } from '../../services/cocktail.service';
import { Cocktail } from '../home/home.component';
import { slugify } from '../../utils/utils';

@Component({
  selector: 'app-alcohol-type-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatProgressSpinnerModule, MatCardModule],
  templateUrl: './alcohol-type-list.component.html',
  styleUrls: ['./alcohol-type-list.component.scss']
})
export class AlcoholTypeListComponent implements OnInit {
  alcoholicType: string = '';
  cocktails: Cocktail[] = [];
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private cocktailService: CocktailService) {}

  ngOnInit(): void {
    this.alcoholicType = this.route.snapshot.paramMap.get('type') || '';
    if (this.alcoholicType) {
      this.isLoading = true;
      this.cocktailService.getCocktailsByAlcoholicType(this.alcoholicType).subscribe({
        next: (res) => {
          this.cocktails = res.drinks || [];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading cocktails:', error);
          this.cocktails = [];
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  getSlug(name: string): string {
    return slugify(name);
  }
}
