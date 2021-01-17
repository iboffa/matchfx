import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerConsoleComponent } from './timer-console.component';

describe('TimerConsoleComponent', () => {
  let component: TimerConsoleComponent;
  let fixture: ComponentFixture<TimerConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerConsoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
