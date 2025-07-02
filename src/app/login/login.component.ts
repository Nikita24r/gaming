import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private as : AlertService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((resp: any) => {
        if (resp.success) {
          this.tokenService.setToken(resp.accessToken, resp.refreshToken);
          this.tokenService.setUser(resp.user);
          this.router.navigate(['/dashboard']);
          this.as.successToast("Login Successfully")
        } else {
          this.as.errorToast('Invalid Credentials')
        }
      })
    }
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value)
        .pipe(
          catchError(error => {
            console.error('Registration failed', error);
            alert('Registration failed. Please try again.');
            return of(null);  // Return an empty observable to continue the stream
          })
        )
        .subscribe(response => {
          if (response) {
            console.log('Registration successful', response);
            alert('Registration successful! You can now log in.');
            this.isLoginMode = true;  // Switch to login mode after successful registration
          }
        });
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

}