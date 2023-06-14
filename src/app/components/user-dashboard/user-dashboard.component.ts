import { Component, OnInit } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  serverUrl = environment.serviceUrl + '/socket';
  title = 'WebSockets chat';
  stompClient;
  question = null;
  timeLeft: number;
  form: FormGroup;
  interval;
  answered: boolean;
  imagePath: any;
  teammates: any;

  constructor(private fb: FormBuilder, private adminService: AdminService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.form = this.fb.group({
      answer: ['', [Validators.required]]
    });
    this.connect();
    let userId = localStorage.getItem('userId');
    console.log(JSON.parse(userId));
    this.adminService.getUserTeammates(JSON.parse(userId)).subscribe(data => {
      this.teammates = data;
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
      }
    }, 1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  connect() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe("/chat", (message) => {
        if (message.body) {
          that.question = JSON.parse(message.body);
          that.imagePath = that.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + that.question.questionImage);
          that.pauseTimer();
          that.answered = false;
          that.timeLeft = that.question.timeLimit;
          that.startTimer();
        }
      });
    });
  }

  onSubmitAnswer() {
    let userId = localStorage.getItem('userId');

    let answer = {
      participantId: JSON.parse(userId),
      questionId: this.question.questionId,
      answer: this.form.get('answer').value,
      answerTime: this.question.timeLimit - this.timeLeft,
    }

    this.answered = true;
    this.adminService.saveUserAnswer(answer).subscribe();
  }

  sendMessage(message) {
    console.log("calling logout api via web socket");
    this.stompClient.send("/app/send/message", {}, JSON.stringify(message));
  }
}
