import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { CocktailService } from '../../services/cocktail.service';
import { Cocktail } from '../home/home.component';
import { slugify } from '../../utils/utils';

@Component({
  selector: 'app-category-cocktail-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './category-cocktail-list.component.html',
  styleUrls: ['./category-cocktail-list.component.scss']
})
export class CategoryCocktailListComponent implements OnInit {
  @ViewChild('slider') slider!: ElementRef<HTMLDivElement>;

  categoryName: string = '';
  cocktails: Cocktail[] = [];
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private cocktailService: CocktailService) {}

  ngOnInit(): void {
    this.categoryName = this.route.snapshot.paramMap.get('categoryName') || '';
    if (this.categoryName) {
      this.isLoading = true;
      this.cocktailService.getCocktailsByCategory(this.categoryName).subscribe({
        next: (res) => {
          if (Array.isArray(res.drinks)){
            this.cocktails = res.drinks;
          } else { // For instance when res={drinks:'no data found'}
            this.cocktails = [];
            console.warn('There is no data or the format is incorrect:', res.drinks);
          }
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

  onWheel(event: WheelEvent) {
    if (event.deltaY !== 0 && this.slider) {
      event.preventDefault();
      const scrollAmount = event.deltaY * 6;
      this.slider.nativeElement.scrollLeft += scrollAmount;
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
}
