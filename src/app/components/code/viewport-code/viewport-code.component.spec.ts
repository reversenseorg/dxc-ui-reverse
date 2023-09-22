import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportCodeComponent } from './viewport-code.component';

describe('ViewportCodeComponent', () => {
  let component: ViewportCodeComponent;
  let fixture: ComponentFixture<ViewportCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
