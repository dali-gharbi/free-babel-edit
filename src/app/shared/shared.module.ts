import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import { NewNodeDialogComponent } from './components/new-node-dialog/new-node-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';

const material = [
  MatButtonModule,
  MatCardModule,
  MatTreeModule,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule,
  MatGridListModule,
  MatDividerModule,
  MatExpansionModule,
  MatInputModule,
  MatCheckboxModule,
  MatDialogModule,
  MatSnackBarModule,
  MatBadgeModule,
  MatMenuModule
];

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, NewNodeDialogComponent],
  entryComponents: [NewNodeDialogComponent],
  imports: [CommonModule, TranslateModule, FormsModule, ...material
  ],
  exports: [TranslateModule, WebviewDirective, NewNodeDialogComponent, FormsModule, ...material
  ]
})
export class SharedModule { }
