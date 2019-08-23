import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserModel } from '../../../models/login/userModel';
import { Router } from '@angular/router';
import { LoginService } from '../../../http/login/login.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  providers: [LoginService]
})
export class LogInComponent implements OnInit {
  /*loginForm = new FormGroup(
    {
      email: new FormControl(''),
      password: new FormControl('')
    }
  );*/
  userModel: UserModel;
  token: String = '';
  userResponse: UserModel;

  // Reactive form builder with a built-in email validation
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  constructor(private formBuilder: FormBuilder, private loginService: LoginService,
    private router: Router) {}

  ngOnInit() {
  }

  // Reactive form submission function
  onSubmit() {
    this.buildUserModel()
  }

  get emailController() {
    return this.loginForm.get('email');
  }

  get passwordController() {
    return this.loginForm.get('password');
  }

  // Construct userModel if form input is valid
  buildUserModel() {
    if(this.loginForm.status == 'VALID'){
      this.userModel = {email: this.loginForm.value.email, password: this.loginForm.value.password}

      this.loginService.logIn(this.userModel).subscribe(
        (data) => {
          this.router.navigate(['/mainChatting'])
        },
        (error) => {
          alert('Email or password does not match, please check your account')
          this.loginForm.reset()
        }
      )
    }

  }

}