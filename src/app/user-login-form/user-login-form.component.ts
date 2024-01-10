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

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  loginUser(): void {
    const userLoginObservable = this.fetchApiData.userLogin(this.userData);

    if (userLoginObservable) {
      userLoginObservable.subscribe(
        (result) => {
          console.log(result);

          // Store the entire user object in localStorage
          localStorage.setItem('user', JSON.stringify(result.user));

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
}
