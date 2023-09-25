import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportAuditComponent } from './viewport-audit.component';

describe('ViewportAuditComponent', () => {
  let component: ViewportAuditComponent;
  let fixture: ComponentFixture<ViewportAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
