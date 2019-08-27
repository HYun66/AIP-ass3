import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { LogInComponent } from './pages/loginPage/log-in/log-in.component';
import { LogoComponent } from './pages/loginPage/logo/logo.component';
import { MainChattingComponent } from './pages/chattingPage/main-chatting/main-chatting.component';
import { SignupComponent } from './pages/signupPage/signup/signup.component';
import { NavigationComponent } from './pages/chattingPage/navigation/navigation.component';
import { UserService } from './pages/user.service';
import { HttpClientModule } from '@angular/common/http';
import { UserRankingComponent } from './pages/chattingPage/main-chatting/user-ranking/user-ranking.component';
import { PicRankingComponent } from './pages/chattingPage/main-chatting/pic-ranking/pic-ranking.component';


@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    LogoComponent,
    MainChattingComponent,
    SignupComponent,
    NavigationComponent,
    UserRankingComponent,
    PicRankingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
