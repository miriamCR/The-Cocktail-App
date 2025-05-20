import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  private apiUrl='https://www.thecocktaildb.com/api/json/v1/1';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list.php?c=list`);
  }

  getCocktailsByFirstLetter(letter: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search.php?f=${letter}`);
  }

  getCocktailsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/filter.php?c=${category}`);
  }

  getCocktailsByCocktailName(cocktailName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search.php?s=${cocktailName}`);
  }

  getCocktailsByIngredient(ingredient: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/filter.php?i=${ingredient}`);
  }
}
