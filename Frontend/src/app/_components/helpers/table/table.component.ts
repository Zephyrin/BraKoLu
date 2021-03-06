import { MatDialog } from '@angular/material/dialog';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { ValueViewChild } from '@app/_services/iservice';
import { MatSort } from '@angular/material/sort';
import { IService } from '@app/_services/iservice';
import { Component, OnInit, Input, ViewChild, AfterViewInit, TemplateRef, Inject, SimpleChange } from '@angular/core';
import { merge } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends ChildBaseComponent<any> implements OnInit, AfterViewInit {
  @Input() service: IService;
  dataSource: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @Input() allowSelection = false;

  constructor(
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver) {
    super(dialog, breakpointObserver);
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    if (this.service.model?.length > 0) {
      this.endUpdate(undefined);
    }
  }

  ngAfterViewInit(): void {
    merge(this.sort.sortChange)
      .pipe(tap(() => {
        this.service.sort.change(this.sort.active, this.sort.direction);
      })).pipe(first()).subscribe();
  }

  public endUpdate(change: SimpleChange) {
    this.dataSource = new MatTableDataSource(this.service.model);
    const index = this.service.displayedColumns.findIndex(x => x === 'action');
    if (index < 0) {
      this.service.displayedColumns.push('action');
    }
    else if (index < this.service.displayedColumns.length - 1) {
      moveItemInArray(this.service.displayedColumns, index, this.service.displayedColumns.length - 1);
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
      this.endUpdate(undefined);
    }
  }

}
