import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalHookComponent } from './terminal-hook.component';

describe('TerminalHookComponent', () => {
  let component: TerminalHookComponent;
  let fixture: ComponentFixture<TerminalHookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalHookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalHookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
