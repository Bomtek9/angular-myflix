import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'], // Fix typo here
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  /**
   * Constructs an instance of the UserLoginFormComponent.
   * @constructor
   * @param {FetchApiDataService} fetchApiData - The service for API communication.
   * @param {MatDialogRef<UserLoginFormComponent>} dialogRef - Reference to the dialog instance.
   * @param {MatSnackBar} snackBar - Service for displaying snack bar notifications.
   * @param {Router} router - Angular router service for navigation.
   */

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  loginUser(): void {
    this.fetchApiData
      .userLogin({
        Username: this.userData.Username,
        Password: this.userData.Password,
      })
      .subscribe(
        (result) => {
          // console.log(result);

          localStorage.setItem('user', JSON.stringify(result.user));
          /**Update: Retrieve and store the token consistently*/
          localStorage.setItem('token', result.token);

          this.dialogRef.close();
          this.snackBar.open('Logged in', 'OK', { duration: 2000 });

          this.router.navigate(['movies']);
        },
        (result) => {
          this.snackBar.open('Login failed', 'OK', { duration: 2000 });
        }
      );
  }
}
