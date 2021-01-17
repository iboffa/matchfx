import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageConsoleComponent } from './message-console.component';

describe('MessageConsoleComponent', () => {
  let component: MessageConsoleComponent;
  let fixture: ComponentFixture<MessageConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageConsoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
