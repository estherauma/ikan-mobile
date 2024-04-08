import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatedetailPage } from './createdetail.page';

describe('CreatedetailPage', () => {
  let component: CreatedetailPage;
  let fixture: ComponentFixture<CreatedetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreatedetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
