import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CompetitionComponent } from './components/competition/competition.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { HostDashboardComponent } from './components/host-dashboard/host-dashboard.component';
import { HostQuestionComponent } from './components/host-question/host-question.component';
import { TeamsComponent } from './components/teams/teams.component';
import { HostCompetitionsComponent } from './components/host-competitions/host-competitions.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin/takmicenja', component: CompetitionComponent },
  { path: 'admin/timovi/:idtakmicenja', component: TeamsComponent },
  { path: 'user', component: UserDashboardComponent },
  { path: 'host/dashboard/:competitionId', component: HostDashboardComponent },
  { path: 'host/pitanja/:competitionId/:questionId', component: HostQuestionComponent },
  { path: 'host', component: HostCompetitionsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
