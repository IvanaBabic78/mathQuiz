import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError = false;    
  form: FormGroup;   
  imagePath: any;
  toReturnImage: any;
  

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', [ Validators.required]],
      password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(36)]],
    });
  }
  

  onLogin() {
    let loginCredentials = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.authService.login(loginCredentials)
      .subscribe(data => {
        if (data != null) {
          if (data.role.name === "admin") {
            localStorage.setItem('token', JSON.stringify({ token: loginCredentials }));
            this.router.navigate(['/admin/takmicenja']);
          } else if (data.role.name === "host") {
            localStorage.setItem('token', JSON.stringify({ token: loginCredentials }));
            this.router.navigate(['/host']);
          } else {
            localStorage.setItem('token', JSON.stringify({ token: loginCredentials }));
            this.router.navigate(['/user']);
          }
          localStorage.setItem("userId", JSON.stringify(data.id));
        } else {
          this.loginError = true;
        }
      },err=>{
        console.log(err.error.message);
        this.loginError = true;
      }
    )
   /* this.authService.login(loginCredentials).subscribe(data => {
      console.log(data)
      if (data != null) {
        if (data.role.name === "admin") {
          localStorage.setItem('token', JSON.stringify({ token: data.id }));
          this.router.navigate(['/admin/takmicenja']);
        } else if (data.role.name === "host") {
          localStorage.setItem('token', JSON.stringify({ token: data.id }));
          this.router.navigate(['/host']);
        } else {
          localStorage.setItem('token', JSON.stringify({ token: data.id }));
          this.router.navigate(['/user']);
        }
      } else {
        this.loginError = true;
      }
    });*/
  }

  onTeamLogin() {
    let loginCredentials = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.authService.loginAsTeam(loginCredentials).subscribe(data => {
      if (data != null) {
        localStorage.setItem('token', JSON.stringify({ token: loginCredentials }));
        this.router.navigate(['/user']);
        localStorage.setItem("userId", JSON.stringify(data.id));
      } else {
        this.loginError = true;
      }
    });
  }
}
