import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalAuditComponent } from './terminal-audit.component';

describe('TerminalHookComponent', () => {
  let component: TerminalAuditComponent;
  let fixture: ComponentFixture<TerminalAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
