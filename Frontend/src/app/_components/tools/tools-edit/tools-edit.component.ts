import { Component, OnInit, Input } from '@angular/core';

interface IEdit {
  edit: boolean;
  canEdit: boolean;
}

@Component({
  selector: 'app-tools-edit',
  templateUrl: './tools-edit.component.html',
  styleUrls: ['./tools-edit.component.scss']
})
export class ToolsEditComponent implements OnInit {
  @Input() service: IEdit;
  constructor(
  ) { }

  ngOnInit(): void {
  }

  changeEdit(evt: any): void {
    this.service.edit = !this.service.edit;
  }
}
