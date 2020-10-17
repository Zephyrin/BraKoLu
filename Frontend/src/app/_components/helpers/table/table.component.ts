import { MatDialog } from '@angular/material/dialog';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { IngredientCreateFormComponent } from '@app/_components/ingredients/ingredient/ingredient-create-form/ingredient-create-form.component';
import { ValueViewChild } from '@app/_services/iservice';
import { MatSort } from '@angular/material/sort';
import { IService } from '@app/_services/iservice';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import 'hammerjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends ChildBaseComponent<IngredientCreateFormComponent> implements OnInit, AfterViewInit {
  @Input() service: IService;
  dataSource: any = [];
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog) {
    super(dialog, IngredientCreateFormComponent);
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    merge(this.sort.sortChange)
      .pipe(tap(() => {
        this.service.sort.change(this.sort.active, this.sort.direction);
      })).subscribe();
  }

  public endUpdate() {
    this.dataSource = new MatTableDataSource(this.service.model);
    const index = this.service.displayedColumns.findIndex(x => x === 'action');
    if (index < 0) {
      this.service.displayedColumns.push('action');
    }
    this.dataSource.sort = this.sort;
  }

  dropListDropped(event: CdkDragDrop<ValueViewChild>) {
    if (event) {
      moveItemInArray(this.service.displayedColumns, event.previousIndex, event.currentIndex);
      const elt = this.service.displayedColumns[event.currentIndex];
      const index = this.service.headers.findIndex(x => x.value === elt);
      moveItemInArray(this.service.headers, index, event.currentIndex);
      localStorage.setItem(this.service.constructor.name + '_headers', JSON.stringify(this.service.headers));
      this.endUpdate();
    }
  }

}
