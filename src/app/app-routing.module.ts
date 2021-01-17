import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  { path: "home",
    loadChildren:()=> import('./home/home.module').then(mod=>mod.HomeModule)
  },
  { path: "graphics",
    loadChildren:()=> import('./graphics/graphics.module').then(mod=>mod.GraphicsModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
