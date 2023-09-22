import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportInspectorComponent } from './viewport-splash.component';

describe('ViewportInspectorComponent', () => {
  let component: ViewportInspectorComponent;
  let fixture: ComponentFixture<ViewportInspectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportInspectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
