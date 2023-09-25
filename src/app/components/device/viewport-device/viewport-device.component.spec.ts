import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportDeviceComponent } from './viewport-device.component';

describe('ViewportDeviceComponent', () => {
  let component: ViewportDeviceComponent;
  let fixture: ComponentFixture<ViewportDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewportDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
