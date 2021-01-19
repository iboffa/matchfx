import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphicsComponent } from './graphics.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes=[
  {path:'', component:GraphicsComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GraphicsComponent],
  exports:[GraphicsComponent]
})
export class GraphicsModule { }
