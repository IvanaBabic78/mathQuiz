import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Competition } from 'src/app/common/models/Competition';

@Component({
  selector: 'app-host-competitions',
  templateUrl: './host-competitions.component.html',
  styleUrls: ['./host-competitions.component.css']
})
export class HostCompetitionsComponent implements OnInit {

  competitions: Competition[];
  currentCompetition: Competition = null;
  messageType: number = 1;

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit() {
    this.listCompetitions();
  }

  listCompetitions() {
    this.adminService.getCompetitions().subscribe(data => {
      this.competitions = data;
      if (data.length == 0) {
        this.messageType = 2;
      } 
    });
  }

  goToCompetition(id: number) {
    this.router.navigate(["host/dashboard", id]);
  }

}
