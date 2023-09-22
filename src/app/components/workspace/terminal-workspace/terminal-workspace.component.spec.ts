import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalWorkspaceComponent } from './terminal-workspace.component';

describe('TerminalWorkspaceComponent', () => {
  let component: TerminalWorkspaceComponent;
  let fixture: ComponentFixture<TerminalWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
