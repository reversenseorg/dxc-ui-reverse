import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableListComponent } from './expandable-list.component';

describe('ExpandableListComponent', () => {
  let component: ExpandableListComponent<any>;
  let fixture: ComponentFixture<ExpandableListComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
