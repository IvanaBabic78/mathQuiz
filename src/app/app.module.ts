import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CompetitionComponent } from './components/competition/competition.component';
import { HostDashboardComponent } from './components/host-dashboard/host-dashboard.component';
import { HostQuestionComponent } from './components/host-question/host-question.component';
import { TeamsComponent } from './components/teams/teams.component';
import { FormsModule } from '@angular/forms';
import { GoogleChartsModule } from 'angular-google-charts';
import { HostCompetitionsComponent } from './components/host-competitions/host-competitions.component';
import { UserNavbarComponent } from './components/user-navbar/user-navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserDashboardComponent,
    NotFoundComponent,
    NavbarComponent,
    CompetitionComponent,
    HostDashboardComponent,
    HostQuestionComponent,
    TeamsComponent,
    HostCompetitionsComponent,
    UserNavbarComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    GoogleChartsModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
