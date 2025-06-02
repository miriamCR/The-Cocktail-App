import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Ingredient } from '../home.component';

@Component({
  selector: 'app-ingredients-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule],
  templateUrl: './ingredients-dialog.component.html',
  styleUrls: ['./ingredients-dialog.component.scss']
})
export class IngredientsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Ingredient[], private dialogRef: MatDialogRef<IngredientsDialogComponent>) {}

  getIngredientImage(nameIngredient: string): string {
    return `https://www.thecocktaildb.com/images/ingredients/${nameIngredient}-medium.png`;
  }
}
