// src/app/user-profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  User: any = {};
  FavoriteMovies: any[] = [];
  Username = '';
  Password = '';
  Email = '';
  Birthday = '';

  /**
   * Constructor to inject services.
   * @constructor
   * @param {FetchApiDataService} fetchApiData - The FetchApiDataService for API communication.
   * @param {DatePipe} datePipe - The DatePipe for date formatting.
   */

  constructor(
    private fetchApiData: FetchApiDataService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  /**
   * User object to store user details.
   * @type {any}
   */

  getUserProfile(): void {
    const storedData = localStorage.getItem('user') || '{}';

    try {
      const user = JSON.parse(storedData);

      if (user && user.Username) {
        this.fetchApiData.getOneUser(user.Username).subscribe(
          (data: any) => {
            this.User = data as any;
            this.Username = this.User.Username;
            this.Email = this.User.Email;
            this.Birthday = this.formatBirthday(this.User.Birthday);

            this.getFavoriteMovies();
          },
          (error) => {
            console.error('Error fetching user data:', error);
          }
        );
      } else {
        console.error('Invalid user data.');
      }
    } catch (parseError) {
      console.error('Error parsing stored data:', parseError);
      // Clear the invalid data from localStorage
      localStorage.removeItem('user');
    }
  }

  getFavoriteMovies(): void {
    if (this.Username) {
      this.fetchApiData
        .getFavoriteMovies(this.Username)
        .subscribe((data: any) => {
          this.FavoriteMovies = data;
          // console.log('Favorite Movies:', this.FavoriteMovies);
        });
    } else {
      console.error('Username is undefined.');
    }
  }
  handleUpdate(): void {
    /**
     * Formats the birthday using DatePipe.
     * @private
     * @method
     * @param {string} birthday - The birthday string.
     * @returns {string} - The formatted birthday string.
     */

    const formattedBirthday = this.formatBirthday(this.Birthday);

    this.fetchApiData
      .editUser({
        Username: this.Username,
        Password: this.Password,
        Email: this.Email,
        Birthday: formattedBirthday,
      })
      .subscribe(
        (response: any) => {
          // Handle success
          console.log('User updated successfully', response);
        },
        (error: any) => {
          // Handle error
          console.error('Error updating user', error);
        }
      );
  }

  deleteAccount(): void {
    // Implement your delete account logic here
  }

  private formatBirthday(birthday: string): string {
    // Use DatePipe to format the birthday
    return this.datePipe.transform(birthday, 'yyyy-MM-dd') || '';
  }
}
