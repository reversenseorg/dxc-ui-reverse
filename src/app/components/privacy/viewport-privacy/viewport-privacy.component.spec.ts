import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportPrivacyDashboardComponent } from './viewport-privacy.component';

describe('ViewportPrivacyDashboardComponent', () => {
  let component: ViewportPrivacyDashboardComponent;
  let fixture: ComponentFixture<ViewportPrivacyDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportPrivacyDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportPrivacyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
