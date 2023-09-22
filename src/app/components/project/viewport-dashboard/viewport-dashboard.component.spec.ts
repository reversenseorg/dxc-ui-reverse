import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportTopoComponent } from './viewport-hook.component';

describe('ViewportHookComponent', () => {
  let component: ViewportTopoComponent;
  let fixture: ComponentFixture<ViewportTopoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportTopoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportTopoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
