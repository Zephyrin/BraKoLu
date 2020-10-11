import { IService } from '@app/_services/iservice';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() service: IService;
  @Input() dataSource: any;
  constructor() { }

  ngOnInit(): void {
  }

}
