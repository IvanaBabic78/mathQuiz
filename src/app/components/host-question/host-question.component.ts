import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AdminService } from 'src/app/services/admin.service';
import { Question } from 'src/app/common/models/Question';
import { QuestionMessage } from 'src/app/common/models/QuestionMessage';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-host-question',
  templateUrl: './host-question.component.html',
  styleUrls: ['./host-question.component.css']
})
export class HostQuestionComponent implements OnInit {
  serverUrl = environment.serviceUrl + '/socket';
  stompClient;
  questionParam: string;
  currentQuestion: Question;
  imagePath: any;
  interval;
  timeLeft: any;
  competitionParam: string;
  correctAnswer: String;
  additionalTime: number;
  title = 'Poeni';
  type = 'ColumnChart';
  graphData: any[] =[[]];
  columnNames = ['Tim', 'Poeni'];
  options = {
    vAxis: {
      gridlines: {
        count: 0
      }
    },
    colors: ['#17A2B8']
  };
  width = 550;
  height = 400;
  teamQuestionPoints: any[];
  updatePointsForm: FormGroup;
  showStartButton = true;
  constructor(private route: ActivatedRoute, private adminService: AdminService, private sanitizer: DomSanitizer, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.checkUser();

    this.initializeWebSocketConnection();
    this.route.params.subscribe((params: Params) => {
      this.questionParam = params['questionId'];
      this.competitionParam = params['competitionId']
    });

    this.additionalTime = 1;
    this.getSelectedQuestion();

    this.updatePointsForm = this.fb.group({
      points: ['', [Validators.required]],
    });
  }

  checkUser() {
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['/login']);
    } 
  }

  onMessage() {
    let message = new QuestionMessage();
    message.questionId = this.currentQuestion.id;
    message.questionText = this.currentQuestion.description;
    message.timeLimit = this.currentQuestion.category.timeLimit;
    message.questionImage = this.currentQuestion.image;
  
    this.timeLeft = this.currentQuestion.category.timeLimit;
    this.pauseTimer();
    this.interval = setInterval(this.startTimer, 1000, this);
    this.stompClient.send("/app/send/message" , {}, JSON.stringify(message));
    this.correctAnswer = '';
    this.showStartButton = false;
  }
  
  getSelectedQuestion() {
    this.adminService.getQuestionById(parseInt(this.questionParam)).subscribe(data => {
      this.currentQuestion = data;
      this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + data.image);
    });
  }

  initializeWebSocketConnection(){
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/host", (message) => {
        if(message.body) {
          console.log(message.body);
        }
      });
    });
  }65

  startTimer(mainObject : HostQuestionComponent) {
    clearInterval(mainObject.interval);
    mainObject.interval = setInterval(mainObject.checkTimer, 1000, mainObject);
  }

  checkTimer(mainObject : HostQuestionComponent) {
    if (mainObject.timeLeft + mainObject.additionalTime > 0) {
      mainObject.timeLeft--;
    } else {
      mainObject.timeLeft = -mainObject.additionalTime;
      clearInterval(mainObject.interval);
      mainObject.setTeamPoints();
    }      
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  setTeamPoints() {
    let data = {
      question: this.currentQuestion,
      competitionId: this.competitionParam
    }
    this.adminService.addTeamPoints(data).subscribe();
    this.correctAnswer = this.currentQuestion.correctAnswer;
  }

  showPoints() {
    this.adminService.getTeamPointsForQuestion(this.competitionParam, this.currentQuestion.id).subscribe(data => {
      this.setBarData(data);
    });

    this.adminService.getTeamAnswerByQuestion(this.competitionParam, this.currentQuestion.id).subscribe(data => {
      this.teamQuestionPoints = data;
    });
  }

  savePoints() {

  }

  setBarData(dataToSet: any[]) {
    let data = [];
    let i: number = 0;
    dataToSet.forEach(element => {
      data[i] = [element.team.name, element.points];
      i++;
    });
    
    this.graphData = data;
  }

  changeAnswer(userId: number, correctAnswer: boolean) {
    this.adminService.changeUserAnswer(userId, this.currentQuestion.id, correctAnswer, parseInt(this.competitionParam)).subscribe(data => {
      this.showPoints();
    });

  }

}
