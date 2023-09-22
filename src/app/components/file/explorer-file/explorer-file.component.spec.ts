import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerFileComponent } from './explorer-file.component';

describe('ExplorerFileComponent', () => {
  let component: ExplorerFileComponent;
  let fixture: ComponentFixture<ExplorerFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorerFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
