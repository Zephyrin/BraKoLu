import { BrewService } from '@app/_services/brew/brew.service';
import { Brew } from '@app/_models/brew';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ValueViewChild } from '@app/_services/iservice';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-brews-table',
  templateUrl: './brews-table.component.html',
  styleUrls: ['./brews-table.component.scss']
})
export class BrewsTableComponent implements AfterViewInit {
  @Input() set dataSource(value: MatTableDataSource<Brew>) {
    this.$dataSource = value;
    this.$dataSource.sort = this.sort;
  }

  get dataSource() { return this.$dataSource; }

  private $dataSource: MatTableDataSource<Brew>;

  @Input() set lastColumn(value: ValueViewChild) {
    this.headers = new Array<ValueViewChild>();
    this.headers.push({ value: 'number', viewValue: 'N°' });
    this.headers.push({ value: 'name', viewValue: 'Type' });

    this.displayedColumns = new Array<string>();
    this.displayedColumns.push('number');
    this.displayedColumns.push('name');
    if (value) {
      this.headers.push(value);
      this.displayedColumns.push(value.value);
    }
    this.displayedColumns.push('action');
  }

  @Output() selected = new EventEmitter<Brew>();
  @Output() deleteBrew = new EventEmitter<DeleteBrewEvent>();
  @ViewChild(MatSort) sort: MatSort;

  public headers: ValueViewChild[];
  public displayedColumns: string[];
  constructor(
    public dialog: MatDialog,
    public service: BrewService) {
  }

  ngAfterViewInit(): void {
  }

  selectedRow(event: MouseEvent, element: Brew) {
    event.stopPropagation();
    this.selected.emit(element);
  }

  deleteBrewClick(event: MouseEvent, element: Brew) {
    event.stopPropagation();
    this.deleteBrew.emit(new DeleteBrewEvent(event, element));
  }
}

export class DeleteBrewEvent {
  mouseEvent: MouseEvent;
  brew: Brew;

  constructor(event: MouseEvent, element: Brew) {
    this.brew = element;
    this.mouseEvent = event;
  }
}
