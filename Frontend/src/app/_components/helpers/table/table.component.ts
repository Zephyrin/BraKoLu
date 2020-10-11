import { MatSort } from '@angular/material/sort';
import { IService } from '@app/_services/iservice';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() service: IService;
  dataSource: any = [];
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    merge(this.sort.sortChange)
      .pipe(tap(() => {
        this.service.sort.change(this.sort.active, this.sort.direction);
      })).subscribe();
  }

  public endUpdate() {
    this.dataSource = new MatTableDataSource(this.service.model);
    this.dataSource.sort = this.sort;

  }
}
