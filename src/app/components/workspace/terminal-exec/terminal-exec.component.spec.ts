import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalExecComponent } from './terminal-exec.component';

describe('TerminalExecComponent', () => {
  let component: TerminalExecComponent;
  let fixture: ComponentFixture<TerminalExecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalExecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalExecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
