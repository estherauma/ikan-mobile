import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewclausePage } from './viewclause.page';

describe('ViewclausePage', () => {
  let component: ViewclausePage;
  let fixture: ComponentFixture<ViewclausePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewclausePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
