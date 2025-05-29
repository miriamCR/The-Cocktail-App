import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcoholTypeListComponent } from './alcohol-type-list.component';

describe('AlcoholTypeListComponent', () => {
  let component: AlcoholTypeListComponent;
  let fixture: ComponentFixture<AlcoholTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlcoholTypeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlcoholTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
