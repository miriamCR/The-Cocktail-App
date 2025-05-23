import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DrinkDetailComponent } from './pages/drink-detail/drink-detail.component';

export const routes: Routes = [
    { path:'', component: HomeComponent }, // Ruta raiz
    { path:'drink/:id/:slug', component: DrinkDetailComponent }, // Pagina de detalles de la bebida
];
