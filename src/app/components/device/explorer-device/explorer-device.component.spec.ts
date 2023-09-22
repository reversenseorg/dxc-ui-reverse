import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerCodeComponent } from './explorer-device.component';

describe('ExplorerCodeComponent', () => {
  let component: ExplorerCodeComponent;
  let fixture: ComponentFixture<ExplorerCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorerCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
