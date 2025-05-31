import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCocktailListComponent } from './category-cocktail-list.component';

describe('CategoryCocktailListComponent', () => {
  let component: CategoryCocktailListComponent;
  let fixture: ComponentFixture<CategoryCocktailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCocktailListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryCocktailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
