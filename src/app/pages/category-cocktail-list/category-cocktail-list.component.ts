import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CocktailService } from '../../services/cocktail.service';
import { Cocktail } from '../home/home.component';
import { slugify } from '../../utils/utils';

@Component({
  selector: 'app-category-cocktail-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './category-cocktail-list.component.html',
  styleUrls: ['./category-cocktail-list.component.scss']
})
export class CategoryCocktailListComponent implements OnInit {
  @ViewChild('slider') slider!: ElementRef<HTMLDivElement>;

  categoryName: string = '';
  cocktails: Cocktail[] = [];
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private cocktailService: CocktailService) {}

  ngOnInit(): void {
    this.categoryName = this.route.snapshot.paramMap.get('categoryName') || '';
    if (this.categoryName) {
      this.loading = true;
      this.cocktailService.getCocktailsByCategory(this.categoryName).subscribe({
        next: (res) => {
          if (Array.isArray(res.drinks)){
            this.cocktails = res.drinks;
          } else { // Por ejemplo, cuando res={drinks:'no data found'}
            this.cocktails = [];
            console.warn('No hay datos o el formato es incorrecto:', res.drinks);
          }
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
  
  scrollLeft() {
    this.slider.nativeElement.scrollBy({ left: -740, behavior: 'smooth' });
  }

  scrollRight() {
    this.slider.nativeElement.scrollBy({ left: 740, behavior: 'smooth' });
  }

  getSlug(name: string): string {
    return slugify(name);
  }

  onWheel(event: WheelEvent) {
    if (event.deltaY !== 0 && this.slider) {
      event.preventDefault();
      const scrollAmount = event.deltaY * 6;
      this.slider.nativeElement.scrollLeft += scrollAmount;
    }
  }
}
