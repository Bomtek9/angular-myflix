// src/app/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  constructor(
    public fetchMovies: FetchApiDataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
    });
  }

  openGenreDialog(genre: string): void {
    this.fetchAndOpenDialog('genre', genre);
  }

  openDirectorDialog(movie: any): void {
    const director = movie.Director; // Adjust the property name based on your API response
    console.log('Clicked Director:', director);
    this.openDialog('director', { director });
  }

  openDescriptionDialog(movie: any): void {
    this.fetchAndOpenDialog('description', movie);
  }

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

  fetchGenreDetails(genreName: string): void {
    this.fetchMovies.getOneGenre(genreName).subscribe((genreDetails: any) => {
      this.openDialog('genre', { genre: genreDetails });
    });
  }

  fetchDirectorDetails(directorName: string): void {
    this.fetchMovies
      .gettOneDirector(directorName)
      .subscribe((directorDetails: any) => {
        this.openDialog('director', { director: directorDetails });
      });
  }

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
