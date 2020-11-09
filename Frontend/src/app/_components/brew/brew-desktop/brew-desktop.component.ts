import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { Brew } from '@app/_models/brew';
import { MatTableDataSource } from '@angular/material/table';
import { TableComponent } from '@app/_components/helpers/table/table.component';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { BrewCreateComponent } from './../brew-create/brew-create.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ValueViewChild } from '@app/_services/iservice';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-brew-desktop',
  templateUrl: './brew-desktop.component.html',
  styleUrls: ['./brew-desktop.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BrewDesktopComponent extends ChildBaseComponent<BrewCreateComponent> implements AfterViewInit {
  @ViewChild('Table') tableComponent: TableComponent;
  dataSource: any = [];
  @ViewChild(MatSort) sort: MatSort;
  public selected: Brew | null;

  constructor(
    public dialog: MatDialog,
    public serviceIngredient: IngredientService) {
    super(dialog, BrewCreateComponent);
    serviceIngredient.load();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
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
      this.endUpdate();
    }
  }

  expandRow(event: MouseEvent, row: Brew) {
    event.stopPropagation();
    this.selected = this.selected === row ? null : row;
  }
}
