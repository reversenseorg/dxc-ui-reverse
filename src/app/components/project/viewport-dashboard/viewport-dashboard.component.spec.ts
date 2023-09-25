import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportProjectDashboardComponent } from './viewport-dashboard.component';

describe('ViewportProjectDashboardComponent', () => {
  let component: ViewportProjectDashboardComponent;
  let fixture: ComponentFixture<ViewportProjectDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportProjectDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportProjectDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
