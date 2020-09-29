import { Component, OnInit, Input } from '@angular/core';
import { Paginate } from '@app/_services/ipaginate';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() paginate: Paginate;

  constructor() { }

  ngOnInit(): void {
  }

}
