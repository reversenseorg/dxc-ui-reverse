import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerNavbarComponent } from './explorer-navbar.component';

describe('ExplorerNavbarComponent', () => {
  let component: ExplorerNavbarComponent;
  let fixture: ComponentFixture<ExplorerNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorerNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
