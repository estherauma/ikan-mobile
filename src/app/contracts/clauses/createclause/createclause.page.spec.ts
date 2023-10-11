import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateclausePage } from './createclause.page';

describe('CreateclausePage', () => {
  let component: CreateclausePage;
  let fixture: ComponentFixture<CreateclausePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateclausePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
