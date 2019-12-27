import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KeyNode } from '../../../project/models/key-node';

@Component({
  selector: 'app-new-node-dialog',
  templateUrl: './new-node-dialog.component.html',
  styleUrls: ['./new-node-dialog.component.scss']
})
export class NewNodeDialogComponent implements OnInit {
  public newNode: KeyNode = new KeyNode();
  constructor(
    public dialogRef: MatDialogRef<NewNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: KeyNode) {
      this.newNode.key = this.data ? this.data.key : '';
      this.newNode.value = this.data ? this.data.value.trimRight() + '.' : '';
  }

  // [mat-dialog-close]="data.value"
  save() {
    this.dialogRef.close(this.newNode);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
