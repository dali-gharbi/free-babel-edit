import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../shared/shared.module';

import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { NgxResizableModule } from '@3dgenomes/ngx-resizable';

@NgModule({
  declarations: [ProjectComponent],
  imports: [CommonModule, SharedModule, ProjectRoutingModule, NgxResizableModule]
})
export class ProjectModule {}
