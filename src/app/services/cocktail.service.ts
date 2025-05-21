import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  private apiUrl='https://www.thecocktaildb.com/api/json/v1/1';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list.php?c=list`);
  }

  getAllIngredients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list.php?i=list`);
  }

  getAllAlcoholicTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list.php?a=list`);
  }

  getCocktailsByFirstLetter(letter: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search.php?f=${letter}`);
  }

  getCocktailsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/filter.php?c=${category}`);
  }

  //Los cocteles que contienen cocktailName en el nombre del coctel (puede ser parte del nombre, no tiene porque ser el nombre entero) -> res = {drinks: Array(9)}
  getCocktailsByCocktailName(cocktailName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search.php?s=${cocktailName}`);
  }

  //Los cocteles que contienen ese ingredient (hay que poner el nombre entero) -> res = {drinks: 'no data found'} | res = {drinks: Array(32)}
  getCocktailsByIngredient(ingredient: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/filter.php?i=${ingredient}`);
  }

  getCocktailsByAlcoholicType(alcoholicType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/filter.php?a=${alcoholicType}`);
  }
}
