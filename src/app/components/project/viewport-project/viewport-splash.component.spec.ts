import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportSplashComponent } from './viewport-splash.component';

describe('ViewportSplashComponent', () => {
  let component: ViewportSplashComponent;
  let fixture: ComponentFixture<ViewportSplashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportSplashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportSplashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
