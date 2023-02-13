import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienDetailsComponent } from './entretien-details.component';

describe('EntretienDetailsComponent', () => {
  let component: EntretienDetailsComponent;
  let fixture: ComponentFixture<EntretienDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntretienDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntretienDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
