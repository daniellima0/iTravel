import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocationModalComponent } from './add-location-modal.component';

describe('AddLocationModalComponent', () => {
  let component: AddLocationModalComponent;
  let fixture: ComponentFixture<AddLocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLocationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
