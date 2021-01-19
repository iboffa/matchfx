import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    loadChildren: () =>
      import("./windows/home/home.module").then((mod) => mod.HomeModule),
  },
  {
    path: "graphics",
    loadChildren: () =>
      import("./windows/graphics/graphics.module").then(
        (mod) => mod.GraphicsModule
      ),
  },
  {
    path: "recorder",
    loadChildren: () =>
      import("./windows/recorder/recorder.module").then(
        (mod) => mod.RecorderModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
