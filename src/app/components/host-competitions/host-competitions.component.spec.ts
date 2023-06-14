import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostCompetitionsComponent } from './host-competitions.component';

describe('HostCompetitionsComponent', () => {
  let component: HostCompetitionsComponent;
  let fixture: ComponentFixture<HostCompetitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostCompetitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostCompetitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
