import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerDeviceComponent } from './explorer-device.component';

describe('ExplorerDeviceComponent', () => {
  let component: ExplorerDeviceComponent;
  let fixture: ComponentFixture<ExplorerDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorerDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
