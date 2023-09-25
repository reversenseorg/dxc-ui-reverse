import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerAuditComponent } from './explorer-audit.component';

describe('ExplorerAuditComponent', () => {
  let component: ExplorerAuditComponent;
  let fixture: ComponentFixture<ExplorerAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorerAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
