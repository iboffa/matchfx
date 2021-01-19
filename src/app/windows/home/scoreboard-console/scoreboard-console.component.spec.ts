import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ScoreboardConsoleComponent } from "./scoreboard-console.component";

describe("ScoreboardConsoleComponent", () => {
  let component: ScoreboardConsoleComponent;
  let fixture: ComponentFixture<ScoreboardConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScoreboardConsoleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreboardConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
