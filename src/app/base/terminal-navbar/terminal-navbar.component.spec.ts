import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalNavbarComponent } from './terminal-navbar.component';

describe('TerminalNavbarComponent', () => {
  let component: TerminalNavbarComponent;
  let fixture: ComponentFixture<TerminalNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
