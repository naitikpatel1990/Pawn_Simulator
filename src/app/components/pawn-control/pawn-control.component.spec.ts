import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PawnControlComponent } from './pawn-control.component';

describe('PawnControlComponent', () => {
  let component: PawnControlComponent;
  let fixture: ComponentFixture<PawnControlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PawnControlComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PawnControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
});
