import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportHookComponent } from './viewport-hook.component';

describe('ViewportHookComponent', () => {
  let component: ViewportHookComponent;
  let fixture: ComponentFixture<ViewportHookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportHookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportHookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
