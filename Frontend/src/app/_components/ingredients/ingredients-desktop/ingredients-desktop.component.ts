import { Subscription } from 'rxjs';
import { IngredientCreateFormComponent } from './../ingredient/ingredient-create-form/ingredient-create-form.component';
import { MatDialog } from '@angular/material/dialog';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-ingredients-desktop',
  templateUrl: './ingredients-desktop.component.html',
  styleUrls: ['./ingredients-desktop.component.scss']
})
export class IngredientsDesktopComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'comment', 'unit', 'unitFactor'];
  private subscribeLoading: Subscription;
  private serviceEndUpdateSubscription: Subscription;
  dataSource: any;
  @Input() service: IngredientService;
  @ViewChild('matTable') matTable: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.subscribeLoading = this.service.loading.subscribe(data => {
      if (data) {
        if (!this.service.errors.hasErrors) {
          this.dialog.closeAll();
        }
      }
    });
    this.serviceEndUpdateSubscription = this.service.endUpdate.subscribe(data => {
      if (data === true) {
        this.dataSource = new MatTableDataSource(this.service.model);
        this.dataSource.sort = this.sort;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscribeLoading) { this.subscribeLoading.unsubscribe(); }
    if (this.serviceEndUpdateSubscription) { this.serviceEndUpdateSubscription.unsubscribe(); }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(IngredientCreateFormComponent, { minWidth: '20em' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

}
