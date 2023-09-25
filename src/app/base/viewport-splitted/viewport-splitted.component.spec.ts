import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportSplittedComponent } from './viewport-splitted.component';

describe('ViewportSplittedComponent', () => {
  let component: ViewportSplittedComponent;
  let fixture: ComponentFixture<ViewportSplittedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportSplittedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportSplittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
