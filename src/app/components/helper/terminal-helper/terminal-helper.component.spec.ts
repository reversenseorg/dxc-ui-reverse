import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalHelperComponent } from './terminal-workspace.component';

describe('TerminalWorkspaceComponent', () => {
  let component: TerminalHelperComponent;
  let fixture: ComponentFixture<TerminalHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
