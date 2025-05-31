import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DrinkDetailComponent } from './pages/drink-detail/drink-detail.component';
import { AlcoholTypeListComponent } from './pages/alcohol-type-list/alcohol-type-list.component';
import { CategoryCocktailListComponent } from './pages/category-cocktail-list/category-cocktail-list.component';

export const routes: Routes = [
    { path:'', component: HomeComponent }, // Ruta raiz
    { path:'drink/:id/:slug', component: DrinkDetailComponent }, // Pagina de detalles de la bebida
    { path:'alcohol-type/:type', component: AlcoholTypeListComponent }, // Pagina con la lista de cocteles de opcion alcoholica
    { path:'category/:categoryName', component: CategoryCocktailListComponent }, // Pagina con la lista de cocteles de una categoria
];
