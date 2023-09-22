import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportMainComponent } from './viewport-main.component';

describe('ViewportMainComponent', () => {
  let component: ViewportMainComponent;
  let fixture: ComponentFixture<ViewportMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
