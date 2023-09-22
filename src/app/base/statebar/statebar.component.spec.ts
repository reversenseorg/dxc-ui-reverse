import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatebarComponent } from './statebar.component';

describe('StatebarComponent', () => {
  let component: StatebarComponent;
  let fixture: ComponentFixture<StatebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
