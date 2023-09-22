import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerHooksComponent } from './explorer-hooks.component';

describe('ExplorerHooksComponent', () => {
  let component: ExplorerHooksComponent;
  let fixture: ComponentFixture<ExplorerHooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorerHooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerHooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
