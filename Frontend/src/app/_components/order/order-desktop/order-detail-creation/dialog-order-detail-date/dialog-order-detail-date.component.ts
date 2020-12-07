import { DialogOrderDetailResult } from './../dialog-order-detail-base';
import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-dialog-order-detail-date',
  templateUrl: './dialog-order-detail-date.component.html',
  styleUrls: ['./dialog-order-detail-date.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class DialogOrderDetailDateComponent {
  newDate: Date;

  constructor(
    public dialogRef: MatDialogRef<DialogOrderDetailDateComponent>) {
    this.newDate = new Date(Date.now());
    this.newDate.setDate(this.newDate.getDate() + 14);
  }

  onNoClick(): void {
    this.dialogRef.close({ data: DialogOrderDetailResult.cancel });
  }

  onSubmit(): void {
    this.dialogRef.close({ data: DialogOrderDetailResult.leaveMissingDate });
  }

  onSubmitWithDate(): void {
    this.dialogRef.close({ data: DialogOrderDetailResult.updateMissingDate, newDate: this.newDate });
  }
}
