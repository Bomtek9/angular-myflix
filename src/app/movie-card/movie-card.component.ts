// src/app/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  /**
   * Constructs an instance of the MovieCardComponent.
   * @constructor
   * @param {FetchApiDataService} fetchMovies - The service for fetching movie data from the API.
   * @param {MatDialog} dialog - Angular Material dialog service for opening dialogs.
   * @param {Router} router - Angular router service for navigation.
   * @param {HttpClient} http - Angular HttpClient service for making HTTP requests.
   */

  constructor(
    public fetchMovies: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Fetches all movies from the API and updates the component's movie list.
   */
  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.movies.forEach((movie) => {
        movie.isFavorite = this.fetchMovies.isFavoriteMovie(movie._id);
      });
      console.log(this.movies);
    });
  }

  /**
   * Opens a dialog displaying genre details for a given movie.
   * @param {any} movie - The movie for which genre details will be displayed.
   */
  openGenreDialog(movie: any): void {
    const genreName = movie.Genre.Name;
    this.fetchAndOpenDialog('genre', genreName);
  }

  /**
   * Opens a dialog displaying director details for a given movie.
   * @param {any} movie - The movie for which director details will be displayed.
   */
  openDirectorDialog(movie: any): void {
    const directorName = movie.Director.Name;
    this.fetchAndOpenDialog('director', directorName);
  }

  /**
   * Opens a dialog displaying description details for a given movie.
   * @param {any} movie - The movie for which description details will be displayed.
   */
  openDescriptionDialog(movie: any): void {
    this.fetchAndOpenDialog('description', movie);
  }

  /**
   * Fetches and opens a dialog based on the specified type and data.
   * @param {string} dialogType - The type of dialog to be opened.
   * @param {any} data - The data to be passed to the dialog.
   */
  fetchAndOpenDialog(dialogType: string, data: any): void {
    switch (dialogType) {
      case 'genre':
        this.fetchGenreDetails(data);
        break;
      case 'director':
        this.fetchDirectorDetails(data);
        break;
      case 'description':
        this.openDialog(dialogType, data);
        break;
      default:
        break;
    }
  }

  /**
   * Fetches genre details and opens a dialog with the provided data.
   * @param {string} genreName - The name of the genre for which details will be fetched.
   */
  fetchGenreDetails(genreName: string): void {
    this.fetchMovies.getOneGenre(genreName).subscribe(
      (genreDetails: any) => {
        console.log('Genre Details:', genreDetails);
        this.openDialog('genre', { movies: genreDetails });
      },
      (error) => {
        console.error('Error fetching genre details:', error);
      }
    );
  }

  /**
   * Fetches director details and opens a dialog with the provided data.
   * @param {string} directorName - The name of the director for which details will be fetched.
   */
  fetchDirectorDetails(directorName: string): void {
    this.fetchMovies.getOneDirector(directorName).subscribe(
      (directorDetails: any) => {
        console.log('Director Details:', directorDetails);
        this.openDialog('director', { movies: directorDetails });
      },
      (error) => {
        console.error('Error fetching director details:', error);
      }
    );
  }

  /**
   * Toggles the favorite status of a movie and updates the local movie list.
   * @param {any} movie - The movie for which the favorite status will be toggled.
   */
  toggleFavoriteMovie(movie: any): void {
    console.log('Toggle favorite movie function called');

    const index = this.movies.findIndex((m) => m._id === movie._id);
    console.log('Index:', index);

    if (index !== -1) {
      const isFavorite = this.fetchMovies.isFavoriteMovie(movie._id);

      if (isFavorite) {
        this.deleteFavoriteMovie(movie);
      } else {
        this.addFavoriteMovie(movie);
      }

      // Update the isFavorite status in the local movies array
      this.movies[index].isFavorite = !isFavorite;
    }
  }

  /**
   * Adds a movie to the user's favorites.
   * @param {any} movie - The movie to be added to favorites.
   */
  addFavoriteMovie(movie: any): void {
    this.fetchMovies.addFavoriteMovie(movie._id).subscribe(() => {
      // console.log('Movie added to favorites:', movie.Title);
    });
  }

  /**
   * Removes a movie from the user's favorites.
   * @param {any} movie - The movie to be removed from favorites.
   */
  deleteFavoriteMovie(movie: any): void {
    this.fetchMovies.deleteFavoriteMovie(movie._id).subscribe(() => {
      // console.log('Movie removed from favorites:', movie.Title);
    });
  }

  /**
   * Opens a generic dialog with the specified type and data.
   * @param {string} dialogType - The type of dialog to be opened.
   * @param {any} data - The data to be passed to the dialog.
   */
  openDialog(dialogType: string, data: any): void {
    const dialogRef = this.dialog.open(MovieDialogComponent, {
      width: '400px',
      data: { dialogType, data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle any logic based on the dialog result
      }
    });
  }
}
