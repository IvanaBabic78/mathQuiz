import { Component, OnInit } from '@angular/core';
import { Competition } from 'src/app/common/models/Competition';
import { AdminService } from 'src/app/services/admin.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Question } from 'src/app/common/models/Question';
import { Router } from '@angular/router';
import { Category } from 'src/app/common/models/Category';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {
  competitions: Competition[];
  questions: Question[];
  selectedCompetition: Competition;
  selectedQuestion: Question;
  form: FormGroup;
  openQuestionForm = false;
  selectedFile = null;
  private base64textString: String = "";
  categories: Category[];
  competitionForm: FormGroup;
  dateError = false;

  constructor(private adminService: AdminService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.checkUser();

    this.listCompetitions();
    this.form = this.fb.group({
      description: [''],
      image: ['', [Validators.required]],
      correctAnswer: ['', [Validators.required]],
      questionType: ['', [Validators.required]],
      category: ['', [Validators.required]],
      questionNumber: ['', [Validators.required]]
    });

    this.competitionForm = this.fb.group({
      name: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      city: ['', [Validators.required]],
    })
  }

  checkUser() {
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['/login']);
    } 
  }
 
  listCompetitions() {
    this.adminService.getCompetitions().subscribe(data => {
      this.competitions = data;
    });
  }

  setSelectedCompetition(id: number) {
    this.selectedCompetition = this.competitions.find(element => element.id == id);
  }

  deleteCompetition() {
    this.adminService.deleteCompetition(this.selectedCompetition.id).subscribe(data => {
      this.listCompetitions();
    });
  }

  addQuestions(id: number) {
    this.form.reset();
    this.setSelectedCompetition(id);
    this.adminService.getCategories().subscribe(data => {
      this.categories = data;
    })
    this.listQuestionsForCompetition();
  }

  listQuestionsForCompetition() {
    this.adminService.getQuestionsByCompetitionNoCategory(this.selectedCompetition.id).subscribe(data => {
      this.questions = data;
    });
  }

  setSelectedQuestion(id: number) {
    this.selectedQuestion = this.questions.find(e => e.id == id);
  }

  deleteQuestion(id: number) {
    let questionCompetition = {
      questionId: id,
      competitionId: this.selectedCompetition.id
    }
    this.adminService.deleteQuestionFromCompetition(questionCompetition).subscribe(data => {
      this.listQuestionsForCompetition();
    })
  }

  openCompetition(id: number) {
    this.router.navigate(["admin/timovi", id]);
  }

  openNewQuestionForm(value: boolean) {
    this.openQuestionForm = value;
  }

  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
  }

  saveQuestion() {
    let questionCompetition = {
      question: {
        description: this.form.get("description").value,
        correctAnswer: this.form.get('correctAnswer').value,
        category: this.categories.find(e => e.id == this.form.get('category').value),
        image: this.base64textString,
        demo: this.form.get('questionType').value == 1,
        additional: this.form.get('questionType').value == 2,
        questionNumber: this.form.get('questionNumber').value
      },
      competitionId: this.selectedCompetition.id
    }
    this.adminService.saveQuestion(questionCompetition).subscribe();
  }

  handleFileSelect(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }


  openCompetitionModal() {
    this.competitionForm.reset();

  }

  saveCompetition() {
    if (this.competitionForm.get("startDate").value > this.competitionForm.get("endDate").value) {
      this.dateError = true;
    } else {
      this.dateError = false;
      let comp = new Competition();
      comp.name = this.competitionForm.get("name").value;
      comp.startDate = this.competitionForm.get('startDate').value;
      comp.endDate = this.competitionForm.get('endDate').value;
      comp.city = this.competitionForm.get('city').value;
      
      this.adminService.addCompetition(comp).subscribe(data => {
        this.listCompetitions();
      }, error => {
        
      })
    }
  }
}
