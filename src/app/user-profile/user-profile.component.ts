// src/app/user-profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] = [];

  constructor(private fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.getFavoriteMovies();
  }

  getUserProfile(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      this.fetchApiData.getOneUser(user.Username).subscribe((data: any) => {
        this.user = data;
      });
    }
  }

  getFavoriteMovies(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      this.fetchApiData
        .getFavoriteMovies(user.Username)
        .subscribe((data: any) => {
          this.favoriteMovies = data;
        });
    }
  }

  // Add more functions as needed for editing user profile and managing favorite movies
}
