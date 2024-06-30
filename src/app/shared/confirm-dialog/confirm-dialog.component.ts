import { Component, Inject } from '@angular/core';
import { DialogConfirmData } from '../../../../models/dialog/dialog.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Operation } from '../../../../models/enum/dialog.enum';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {

  constructor (
    private dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
     @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData,

  ) {}

  public onCancel () : void {
    this.dialogRef.close(false);
  }

  public onConfirm() : void {
    this.dialogRef.close(true);
  }


}
