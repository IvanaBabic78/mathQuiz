import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { User } from "../../common/models/User";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  currentTeam: any;
  competitionIdParam: string;
  curentTeamUsers: User[] = [];
  teams: any[]
  form: FormGroup;   
  formTeam: FormGroup;
  newUserForm = false;
  competition: any;
  selectedUser: any;
  teamCaptain: any;
  teamCaptains: any[];

  constructor(private adminService: AdminService, private fb: FormBuilder, private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    this.checkUser();

    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required ]],
      grade: ['', [Validators.required, Validators.min(1), Validators.max(8)]],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.formTeam = this.fb.group({
      name: ['', [Validators.required]],
      school: ['', [Validators.required ]],
      city: ['', Validators.required],
    });

    this.route.params.subscribe((params: Params) => this.competitionIdParam = params['idtakmicenja']);
    this.listTeamsByCompetition();
    this.getCurrentCompetition();
  
  }

  checkUser() {
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['/login']);
    }
  }

  getCurrentCompetition() {
    this.adminService.getCompetitions().subscribe(data => {
      this.competition = data.find(e => e.id == parseInt(this.competitionIdParam));
    })
  }

  listTeamsByCompetition() {
    this.adminService.getTeamsByCompetition(parseInt(this.competitionIdParam)).subscribe(data => {
        this.teams = data;
      });

    this.adminService.getTeamCaptaintsByCompetition(parseInt(this.competitionIdParam)).subscribe(data => {
      this.teamCaptains = data;
    })
  }

  getCaptain(captainId: number) {
    let captain = this.teamCaptains.find(e => e.id == captainId);
    if (captain) {
      return captain.name;
    }
  }

  setSelectedTeam(team: any) {
    this.currentTeam = team;
  }

  deleteTeam() {
    this.adminService.deleteTeam(this.currentTeam.id).subscribe(data => {
      this.listTeamsByCompetition();
    });
    
  }

  openTeamParticipants(id: number) {
    this.setSelectedTeam(this.teams.find(e => e.id == id));
    this.listParticipantsForTeam(id);
  }

  listParticipantsForTeam(id: number) {
    this.adminService.getUsersFromTeam(id).subscribe(data => {
      this.curentTeamUsers = data;
    });
  }

  openNewUserForm(value: boolean) {
    this.newUserForm = value;
    this.setSelectedUser(null);
    this.form.reset();
    this.form.markAsUntouched();
  }

  deleteUser(id: number) {
    let that = this;
    this.adminService.deleteUser(id).subscribe(data => {
      this.openTeamParticipants(parseInt(that.competitionIdParam));
    });
  }

  saveTeam() {
    let team; 
    if (this.currentTeam != null) {
      team = {
        id: this.currentTeam.id,
        name: this.formTeam.get('name').value,
        school: this.formTeam.get('school').value,
        city: this.formTeam.get('city').value,
        competitionId: this.competitionIdParam,
        captainId: this.currentTeam.captainId
      }
    } else {
      team = {
        name: this.formTeam.get('name').value,
        school: this.formTeam.get('school').value,
        city: this.formTeam.get('city').value,
        competitionId: this.competitionIdParam,
      }
    }
    this.adminService.saveTeam(team).subscribe(data => {
      this.listTeamsByCompetition();
    });
  }

  editTeam(team: any) {
    this.setSelectedTeam(team);
    if(this.currentTeam != null) {
      this.formTeam.get('name').setValue(this.currentTeam.name);
      this.formTeam.get('school').setValue(this.currentTeam.school);
      this.formTeam.get('city').setValue(this.currentTeam.city);
    } else {
      console.log('Something went wrong :)');
    }
  }

  openAddNewTeamModal() {
    this.setSelectedTeam(null);
    this.formTeam.reset();
    this.formTeam.markAsUntouched();
  }

  setSelectedUser(user: any) {
    this.selectedUser = user;
  }

  addNewUser() {
    let userWithLogin = {
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      grade: this.form.get('grade').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value,
      teamId: this.currentTeam.id
    }
    let that = this;
    console.log(userWithLogin);
    this.adminService.addUserLoginAndTeam(userWithLogin).subscribe(data => {
      that.listParticipantsForTeam(that.currentTeam.id);
    });
  }

  addCaptainToTeam() {
    let team = {
      id: this.currentTeam.id,
      name: this.currentTeam.name,
      school: this.currentTeam.school,
      city: this.currentTeam.city,
      competitionId: this.competitionIdParam,
      captainId: this.teamCaptain
    }
   this.adminService.saveTeam(team).subscribe(data => {
     this.listTeamsByCompetition();
   });
  
  }

  openAddCaptainToteam(id: number) {
    this.setSelectedTeam(this.teams.find(e => e.id == id));
    this.adminService.getUsersFromTeam(this.currentTeam.id).subscribe(data => {
      this.curentTeamUsers = data;
    });
  }
}
