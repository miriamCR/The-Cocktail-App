import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { CocktailService } from '../../services/cocktail.service';
import { Cocktail } from '../home/home.component';

@Component({
  selector: 'app-alcohol-type-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './alcohol-type-list.component.html',
  styleUrl: './alcohol-type-list.component.scss'
})
export class AlcoholTypeListComponent implements OnInit {
  cocktails: Cocktail[] = [];
  alcoholicType: string = '';

  constructor(private route: ActivatedRoute, private cocktailService: CocktailService) {}

  ngOnInit(): void {
    this.alcoholicType = this.route.snapshot.paramMap.get('type') || '';
    if (this.alcoholicType) {
      this.cocktailService.getCocktailsByAlcoholicType(this.alcoholicType).subscribe(res => {
        this.cocktails = res.drinks || [];
      });
    }
  }
}
