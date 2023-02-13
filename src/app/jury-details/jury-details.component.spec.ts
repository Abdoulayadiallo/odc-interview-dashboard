import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuryDetailsComponent } from './jury-details.component';

describe('JuryDetailsComponent', () => {
  let component: JuryDetailsComponent;
  let fixture: ComponentFixture<JuryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JuryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
