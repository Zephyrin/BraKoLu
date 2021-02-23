import { Subscription } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IService } from '@app/_services';

@Component({
  selector: 'app-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.scss']
})
export class RemoveDialogComponent implements OnInit {
  title: string;
  service: IService;
  element: any;

  afterUpdateSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<RemoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: boolean) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.element && this.service) {
      this.afterUpdateSubscription = this.service.endUpdate.subscribe(result => {
        if (this.afterUpdateSubscription) { this.afterUpdateSubscription.unsubscribe(); }
        if (!this.service.hasErrors()) {
          this.dialogRef.close({ data: true });
        }
      });
      this.service.update(undefined, this.element, null);
    }
    else {
      this.dialogRef.close({ data: true });
    }
  }
}
