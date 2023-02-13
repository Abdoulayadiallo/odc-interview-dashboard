import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostulantDetailsComponent } from './postulant-details.component';

describe('PostulantDetailsComponent', () => {
  let component: PostulantDetailsComponent;
  let fixture: ComponentFixture<PostulantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostulantDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostulantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
