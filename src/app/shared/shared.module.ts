import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';


@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective],
  imports: [CommonModule, TranslateModule, FormsModule, MatButtonModule, MatCardModule, MatTreeModule, MatIconModule, MatToolbarModule,],
  exports: [TranslateModule, WebviewDirective, FormsModule, MatButtonModule, MatCardModule, MatTreeModule, MatIconModule, MatToolbarModule,]
})
export class SharedModule {}
