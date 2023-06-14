import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Competition } from '../common/models/Competition';
import { Question } from '../common/models/Question';
import { Category } from '../common/models/Category';

const SERVER_URL = environment.serviceUrl;
const ADMIN_API_URLS = {
  COMPETITIONS: '/admin/competitions',
  COMPETITION: '/admin/competition',
  TEAMS: '/team',
  QUESTION: '/question',
  USER: '/user'
};

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private base64Credential: string;
  private httpHeaders: any;

  addCompetition(competition: Competition) {
    return this.http.post<any>(SERVER_URL + ADMIN_API_URLS.COMPETITION, competition, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('addCompetition'))
    );
  }

  saveQuestion(question: any) {
    return this.http.post<any>(SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.QUESTION, question, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('saveTeam'))
    );
  }

  addUserLoginAndTeam(userLogin: any) {
    return this.http.post<any>(SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.TEAMS + "/assign", userLogin, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('addUserLoginAndTeam'))
    );
  }

  saveUserAnswer(answer: any) {
    return this.http.post<any>(SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.TEAMS + "/answer", answer, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('saveUserAnswer'))
    );
  }

  addTeamPoints(data: any) {
    return this.http.post<any>(SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.TEAMS + "/addpoints", data, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('addTeamPoints'))
    );
  }

  saveTeam(team: any) {
    return this.http.post<any>(SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.TEAMS, team, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('saveTeam'))
    );
  }

  deleteTeam(id: number): Observable<any> {
    const url = `${SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.TEAMS}/${id}`;

    return this.http.delete<any>(url, this.httpHeaders).pipe(
      catchError(this.handleError<any>('deleteTeam'))
    );
  }

  deleteUser(id: number): Observable<any> {
    const url = `${SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.TEAMS + ADMIN_API_URLS.USER}/${id}`;

    return this.http.delete<any>(url, this.httpHeaders).pipe(
      catchError(this.handleError<any>('deleteUser'))
    );
  }

  constructor(private http: HttpClient) {
    let creds = JSON.parse(localStorage.getItem("token"));
    console.log(creds.token.username + ':' + creds.token.password)
    this.base64Credential = btoa(creds.token.username + ':' + creds.token.password);

    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json', 
        'Authorization': 'Basic ' + this.base64Credential
      })
    };
   }

  getCompetitions(): Observable<Competition[]> {

    return this.http.get<any>(SERVER_URL + ADMIN_API_URLS.COMPETITIONS, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('login'))
    );
  }
  
  deleteCompetition(compId: number): Observable<any> {
    const url = `${SERVER_URL + ADMIN_API_URLS.COMPETITION}/${compId}`;

    return this.http.delete<any>(url, this.httpHeaders).pipe(
      catchError(this.handleError<any>('deleteCompetition'))
    );
  }

  getQuestionsByCompetition(id: number): Observable<any[]> {
    const question = "question";
    const url = `${SERVER_URL + ADMIN_API_URLS.COMPETITION}/${id}/${question}`;

    return this.http.get<any>(url, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('getQuestions'))
    );
  }

  getQuestionsByCompetitionNoCategory(id: number): Observable<Question[]> {
    const url = `${SERVER_URL + ADMIN_API_URLS.COMPETITION}/${id}${ADMIN_API_URLS.QUESTION + "/nocategory"}`;

    return this.http.get<any>(url, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('getQuestions'))
    );
  }

  deleteQuestionFromCompetition(questionCompetition: any): Observable<any> {
    const url = SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.QUESTION + "/delete";

    return this.http.post<any>(url, questionCompetition, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('deleteQuestion'))
    );
  }


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
  
  getTeamsPariticipantsByCompetition(competitionId: number): Observable<any[]> {
    const url = `${SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.TEAMS + "/teamparticipant"}/${competitionId}`;
    return this.http.get<any>(url, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('getTeamsPariticipants'))
    );
  }

  getQuestionById(id: number): Observable<Question> {
    const url = `${SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.QUESTION}/${id}`;

    return this.http.get<any>(url, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('getQuestion'))
    );
  }

  getTeamsByCompetition(id: number): Observable<any> {
    let team = "team";
    const url = `${SERVER_URL + ADMIN_API_URLS.COMPETITION}/${id}/${team}`;

    return this.http.get<any>(url, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('getTeamsByCompetition'))
    );
  }

  getUsersFromTeam(id: number): Observable<any> {
    const url = `${SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.TEAMS}/${id}${ADMIN_API_URLS.USER}`;

    return this.http.get<any>(url, this.httpHeaders)
    .pipe(
      catchError(this.handleError<any>('getUsersFromTeam'))
    );
  }

getCategories(): Observable<Category[]> {
  return this.http.get<any>(SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.QUESTION + "/categories", this.httpHeaders)
  .pipe(
    catchError(this.handleError<any>('getCategories'))
  );
}

getUserTeammates(userId: number): Observable<any> {
  const url = `${SERVER_URL + ADMIN_API_URLS.COMPETITION + ADMIN_API_URLS.TEAMS + "/fkmylife"}/${userId}`;

  return this.http.get<any>(url, this.httpHeaders)
  .pipe(
    catchError(this.handleError<any>('getUserTeammates'))
  );
}

getTeamPointsForQuestion(competitionId, questionId: number): Observable<any> {
  const team = "team";
  const points = "points"
  const url = `${SERVER_URL + ADMIN_API_URLS.COMPETITION}/${competitionId}/${team}/${questionId}/${points}`;

  return this.http.get<any>(url, this.httpHeaders)
  .pipe(
    catchError(this.handleError<any>('getTeamPointsForQuestion'))
  );
}

getTeamAnswerByQuestion(competitionId, questionId: number): Observable<any> {
  const team = "team";
  const answer = "answer"
  const url = `${SERVER_URL + ADMIN_API_URLS.COMPETITION}/${competitionId}/${team}/${questionId}/${answer}`;

  return this.http.get<any>(url, this.httpHeaders)
  .pipe(
    catchError(this.handleError<any>('getTeamAnswerByQuestion'))
  );
}

changeUserAnswer(uId: number, qId: number, correctAnswer: boolean, compId: number) {
  let data = {
    userId: uId,
    questionId: qId,
    correct: correctAnswer,
    competitionId: compId
  }
  return this.http.post<any>(SERVER_URL + "/changeAnswer", data, this.httpHeaders)
  .pipe(
    catchError(this.handleError<any>('changeUserAnswer'))
  );
} 

getTeamCaptaintsByCompetition(competitionId: number): Observable<any> {
  let team = "/teamcaptains";
  const url = `${SERVER_URL + team}/${competitionId}`;

  return this.http.get<any>(url, this.httpHeaders)
  .pipe(
    catchError(this.handleError<any>('getTeamCaptaintsByCompetition'))
  );
}
}
