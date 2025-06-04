# The Cocktail App 🍹

🌐 **Demo en línea**:  [https://thecocktailapp-mcr.netlify.app/](https://thecocktailapp-mcr.netlify.app/)

Aplicación web desarrollada en Angular 19 que permite explorar diferentes cócteles obtenidos a través de la API pública [TheCocktailDB](https://www.thecocktaildb.com/api.php).




## 🧪 Funcionalidades principales
- **Búsqueda y filtrado de cócteles por:**
    - Primera letra del nombre
    - Categoría
    - Ingrediente
    - Nombre
    - Contenido de alcohol

- **Visualización de cócteles en tabla**, mostrando:
    - ID (clicable, nos lleva a una página donde se muestran más detalles del cóctel)
    - Imagen
    - Nombre
    - Categoría
    - Tipo (alcohólico, no alcohólico o con alcohol opcional)
    - Cantidad de ingredientes (abre un modal con lista de ingredientes, medidas e imágenes)
    - Fecha de modificación

- **Pie de tabla con contadores de cócteles** según la búsqueda realizada: 
    - Número total de cócteles
    - Número de cócteles alcohólicos
    - Número de cócteles no alcohólicos
    - Número de cócteles con alcohol opcional

- **Botón de cóctel aleatorio** accesible desde cualquier parte de la aplicación.

- **Página de detalles del cóctel,** mostrando:
    - Nombre
    - Imagen
    - Categoría (clicable, con slider de cócteles de esa categoría)
    - Contenido de alcohol
    - Instrucciones (con opción de cambiar el idioma de las instrucciones)
    - Ingredientes y medidas

> ⚠️ **Limitación de la API pública**
>
> Esta aplicación depende de la API gratuita de [TheCocktailDB](https://www.thecocktaildb.com/api.php), la cual puede tener ciertas restricciones de uso. A veces, si se realizan muchas peticiones seguidas (por ejemplo, al cambiar de filtro muy rápido o pulsar varias veces el botón de cóctel aleatorio), puede ocurrir un fallo temporal debido a un límite de peticiones por tiempo. En esos casos, puede parecer que la aplicación se queda cargando indefinidamente o mostrar que no hay datos. Si ocurre, se recomienda esperar unos segundos antes de intentarlo de nuevo o refrescar la página web.


## 🚀 Tecnologías utilizadas
- Angular CLI (v19.2.12)
- Angular 19
- Angular Material
- Typescript
- HTML/SCSS
- API pública TheCocktailDB

## ▶️ Guía para ejecutar el proyecto
1. **Clona este repositorio**:
```bash
git clone https://github.com/miriamCR/The-Cocktail-App.git
cd The-Cocktail-App
````

2. **Instala las dependencias**:
````bash
npm install
````

3. **Ejecuta la aplicación en desarrollo**:
````bash
ng serve
````
Abre tu navegador y navega a http://localhost:4200/.

4. **Genera el build para producción**:
````bash
ng build --configuration production
````
Esto creará una versión optimizada en la carpeta `dist/`. A continuación, podrás desplegar esta carpeta en un hosting para hacer que la aplicación sea accesible de forma online, por ejemplo, **Netlify**.

  💡Si no quieres instalar nada localmente, puedes acceder a la [demo en linea](https://thecocktailapp-mcr.netlify.app/).
  <br>
  <br>

> **ℹ️ Nota**
>
> Para que funcione correctamente esta guía de instalación, se recomienda que utilices las últimas versiones de **Node.js** (la aplicación fue desarrollada con la v22.15.1).

## 📚 Documentación y recursos utilizados
- [Angular Docs](https://angular.dev/overview)
- [Angular Material](https://material.angular.dev)
- [StackOverflow](https://stackoverflow.com/questions)
- [TheCocktailDB API](https://www.thecocktaildb.com/api.php)

### Iconos
* Los iconos de las banderas son de <a href="https://www.countryflags.com/" title="Countryflags">www.countryflags.com</a>


