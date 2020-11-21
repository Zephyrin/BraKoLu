import { FormControl } from '@angular/forms';
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
  public formSelectedBrew = new FormControl(0);
  public selectedBrews = new Array<Brew>();

  public createdBrews: Brew[];
  public brewsViewList = new Array<AccordionExtension>();
  constructor(
    public dialog: MatDialog,
    public serviceIngredient: IngredientService) {
    super(dialog, BrewCreateComponent);
    serviceIngredient.load();
  }

  ngAfterViewInit(): void {
  }

  public endUpdate() {
    this.brewsViewList.push({
      title: 'À planifier',
      dataSource: this.service.model.filter(x => x.state === 'created'),
      lastColumn: { value: 'created', viewValue: 'Créé le' }
    });
    this.brewsViewList.push({
      title: 'Planifier',
      dataSource: this.service.model.filter(x => x.state === 'planed'),
      lastColumn: { value: 'planed', viewValue: 'Planifier le' }
    });
    this.brewsViewList.push({
      title: 'En Fermentation',
      dataSource: this.service.model.filter(x => x.state === 'brewing'),
      lastColumn: { value: 'packaging', viewValue: 'Conditionnement le' }
    });
    this.brewsViewList.push({
      title: 'En conditionnement',
      dataSource: this.service.model.filter(x => x.state === 'packaging'),
      lastColumn: { value: 'availableAt', viewValue: 'Disponible le' }
    });
    this.brewsViewList.push({
      title: 'Disponible & archivé',
      dataSource: this.service.model.filter(x => x.state === 'complete' || x.state === 'archived'),
      lastColumn: undefined
    });
  }

  public openTab(brew: Brew) {
    const index = this.selectedBrews.findIndex(x => x.id === brew.id);
    if (index >= 0) {
      this.formSelectedBrew.setValue(index + 1);
    } else {
      this.selectedBrews.push(brew);
      this.formSelectedBrew.setValue(this.selectedBrews.length);
    }
  }

  public closeTab(event: MouseEvent, brew: Brew, index: number) {
    event.stopPropagation();
    this.formSelectedBrew.setValue(0);
    this.selectedBrews.splice(index, 1);
  }
}

class AccordionExtension {
  title: string;
  dataSource: any[];
  lastColumn: ValueViewChild;
}
