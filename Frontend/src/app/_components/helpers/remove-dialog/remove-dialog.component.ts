import { FormErrors } from '@app/_helpers/form-error';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.scss']
})
export class RemoveDialogComponent implements OnInit {
  loading = false;
  submitted = false;
  errors = new FormErrors();
  title: string;

  constructor(
    public dialogRef: MatDialogRef<RemoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: boolean) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close({ data: true });
  }
}
