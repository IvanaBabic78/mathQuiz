import { Component, OnInit } from '@angular/core';
import { HostService } from 'src/app/services/host.service';
import { AdminService } from 'src/app/services/admin.service';
import { Question } from 'src/app/common/models/Question';
import { Router } from '@angular/router';
import { Competition } from 'src/app/common/models/Competition';
import { ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-host-dashboard',
  templateUrl: './host-dashboard.component.html',
  styleUrls: ['./host-dashboard.component.css']
})
export class HostDashboardComponent implements OnInit {

  categories: any[];
  teamParticipants: any[];
  competitions: Competition[];
  currentCompetition: Competition;
  currentCompetitionIdParam: any;
  teamParticipantsSortedForScore: any[];
  categoryImageSrc: any;
  title = 'Poeni';
   type = 'ColumnChart';
   data: any[] =[[]];
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

  constructor(private hostService: HostService, private adminService: AdminService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.checkUser();
    this.activatedRoute.params.subscribe((params: Params) => this.currentCompetitionIdParam = params['competitionId']);
    this.getCurrentCompetition();
    this.listTeamsParticipants();
    this.listQuestionsForCompetition();
  }

  checkUser() {
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['/login']);
    }
  }

  getCurrentCompetition() {
    this.adminService.getCompetitions().subscribe(data => {
      this.currentCompetition = data.find(e => e.id == this.currentCompetitionIdParam);
    })
  }

  listTeamsParticipants() {
    this.adminService.getTeamsPariticipantsByCompetition(this.currentCompetitionIdParam).subscribe(data => {
      this.teamParticipants = data;
      this.teamParticipantsSortedForScore = data.sort(function(a,b) {return (a.team.numOfPoints < b.team.numOfPoints) ? 1 : ((b.team.numOfPoints < a.team.numOfPoints) ? -1 : 0);} );
      this.setBarData();
    });
  }

  setBarData() {
    let data = [];
    let i: number = 0;
    this.teamParticipantsSortedForScore.forEach(element => {
      data[i] = [element.team.name, element.team.numOfPoints];
      i++;
    });
    
    this.data = data;
  }

  listQuestionsForCompetition() {
    this.adminService.getQuestionsByCompetition(this.currentCompetitionIdParam).subscribe(data => {
      this.categories = data.sort(function(a,b) {return (a.category.id > b.category.id) ? 1 : ((b.category.id > a.category.id) ? -1 : 0);} );

      for(let i = 0; i < this.categories.length; i++)
      {
        let category = this.categories[i];

        //distinct teams
        category.teams = [];

        for(let j = 0; j < category.teamQuestionPoints.length; j++)
        {
          let teamQuestionPoint = category.teamQuestionPoints[j];

          let found = false;
          for(let k = 0; k < category.teams.length; k++)
          {
            if(teamQuestionPoint.team.id == category.teams[k].id)
            {
              found = true;
              break;
            }
          }

          if(!found)
          {
            category.teams.push(teamQuestionPoint.team);
          }
        }

        //sort questions
        category.demoQuestions = [];
        category.additionalQuestions = [];
        category.regularQuestions = [];

        for(let j = 0; j < category.questions.length; j++)
        {
          let question = category.questions[j];

          question.teamPoints = [];

          for(let k = 0; k < category.teams.length; k++)
          {
            let team = category.teams[k];
            for(let l = 0; l < category.teamQuestionPoints.length; l++)
            {
              let teamQuestionPoint = category.teamQuestionPoints[l];

              if(team.id == teamQuestionPoint.team.id && question.id == teamQuestionPoint.questionId)
              {
                question.teamPoints.push(teamQuestionPoint);
                break;
              }
            }
          }

          if(question.demo)
          {
            category.demoQuestions.push(question);
          }
          else if(question.additional)
          {
            category.additionalQuestions.push(question);
          }
          else
          {
            category.regularQuestions.push(question);
          }

        }
      }

    });
  }

  openQuestion(category: any, id: number) {
    let questionCategory = this.categories.find(e => e.category == category);
    let question = questionCategory.questions.find(e => e.id == id);
    this.router.navigate(["host/pitanja", this.currentCompetition.id, question.id]);
  }

  setCategoryImageSource(category: any) {
    if (category.id == "2") this.categoryImageSrc = "../../../assets/a.jpg";
    else if (category.id == "3") this.categoryImageSrc = "../../../assets/b.jpg";
    else if (category.id == "4") this.categoryImageSrc = "../../../assets/v.jpg";
    else if (category.id == "5") this.categoryImageSrc = "../../../assets/g.jpg";
  }
}
