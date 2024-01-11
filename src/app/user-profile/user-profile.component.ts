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

  constructor(
    private fetchApiData: FetchApiDataService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
    // No need to call getFavoriteMovies here, as it's called within getUserProfile
  }

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
    // Ensure that this.Username is defined before calling the service
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
    // Format the birthday using DatePipe
    const formattedBirthday = this.formatBirthday(this.Birthday);

    // Implement your update logic here
    // You can use this.Username, this.Password, this.Email, formattedBirthday
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
