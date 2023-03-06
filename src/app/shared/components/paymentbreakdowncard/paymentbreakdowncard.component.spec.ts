import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentbreakdowncardComponent } from './paymentbreakdowncard.component';

describe('PaymentbreakdowncardComponent', () => {
  let component: PaymentbreakdowncardComponent;
  let fixture: ComponentFixture<PaymentbreakdowncardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentbreakdowncardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentbreakdowncardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
