import { DeleteBrewEvent } from './brews-table/brews-table.component';
import { FormControl } from '@angular/forms';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Brew } from '@app/_models/brew';
import { MatTableDataSource } from '@angular/material/table';
import { ChildBaseComponent } from '@app/_components/child-base-component';
import { BrewCreateComponent } from './../brew-create/brew-create.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild, AfterViewInit, SimpleChange } from '@angular/core';
import { ValueViewChild } from '@app/_services/iservice';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';

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
    public breakpointObserver: BreakpointObserver,
    public serviceIngredient: IngredientService) {
    super(dialog, breakpointObserver);
    this.componentOrTemplateRef = BrewCreateComponent;
    serviceIngredient.load();
  }

  ngAfterViewInit(): void {
  }

  public endUpdate(change: SimpleChange) {
    if (change === undefined) {
      this.brewsViewList.push({
        title: 'À planifier',
        dataSource: new MatTableDataSource<Brew>(this.service.model.filter(x => x.state === 'created')),
        lastColumn: { value: 'created', viewValue: 'Créé le' }
      });
      this.brewsViewList.push({
        title: 'Planifier',
        dataSource: new MatTableDataSource<Brew>(this.service.model.filter(x => x.state === 'planed')),
        lastColumn: { value: 'started', viewValue: 'Planifier le' }
      });
      this.brewsViewList.push({
        title: 'En Fermentation',
        dataSource: new MatTableDataSource<Brew>(this.service.model.filter(x => x.state === 'brewing')),
        lastColumn: { value: 'packaging', viewValue: 'Conditionnement le' }
      });
      this.brewsViewList.push({
        title: 'En conditionnement',
        dataSource: new MatTableDataSource<Brew>(this.service.model.filter(x => x.state === 'packaging')),
        lastColumn: { value: 'availableAt', viewValue: 'Disponible le' }
      });
      this.brewsViewList.push({
        title: 'Disponible & archivé',
        dataSource: new MatTableDataSource<Brew>(this.service.model.filter(x => x.state === 'complete' || x.state === 'archived')),
        lastColumn: undefined
      });
    } else {
      if (change.previousValue instanceof Brew || change.currentValue instanceof Brew) {
        if (change.previousValue === undefined || change.previousValue === null) {
          // C'est un ajout.
          this.pushToCorrectList(change.currentValue);
          this.openTab(change.currentValue);
        } else if (change.currentValue === undefined || change.currentValue === null) {
          // C'est une suppression...
          this.deleteFromList(this.selectedBrews, change.previousValue);
          this.deleteFormCorrectList(change.previousValue);
        } else {
          // On regarde si il y a eu un changement de status
          if (change.previousValue.state !== change.currentValue.state) {
            this.deleteFormCorrectList(change.previousValue);
            this.pushToCorrectList(change.currentValue);
          }
        }
      }
    }
  }

  private deleteFormCorrectList(item: Brew) {
    let data: Brew[];
    let i: number;
    switch (item.state) {
      case 'created':
        data = this.brewsViewList[0].dataSource.data;
        i = 0;
        break;
      case 'planed':
        data = this.brewsViewList[1].dataSource.data;
        i = 1;
        break;
      case 'brewing':
        data = this.brewsViewList[2].dataSource.data;
        i = 2;
        break;
      case 'packaging':
        data = this.brewsViewList[3].dataSource.data;
        i = 3;
        break;
      default:
        data = this.brewsViewList[4].dataSource.data;
        i = 4;
        break;
    }
    this.deleteFromList(data, item);
    this.brewsViewList[i].dataSource.data = data;
  }
  private pushToCorrectList(item: Brew) {
    let data: Brew[];
    let i: number;
    switch (item.state) {
      case 'created':
        data = this.brewsViewList[0].dataSource.data;
        i = 0;
        break;
      case 'planed':
        data = this.brewsViewList[1].dataSource.data;
        i = 1;
        break;
      case 'brewing':
        data = this.brewsViewList[2].dataSource.data;
        i = 2;
        break;
      case 'packaging':
        data = this.brewsViewList[3].dataSource.data;
        i = 3;
        break;
      default:
        data = this.brewsViewList[4].dataSource.data;
        i = 4;
        break;
    }
    data.push(item);
    this.brewsViewList[i].dataSource.data = data;
  }
  private deleteFromList(list: Brew[], item: Brew) {
    const index = list.findIndex(x => x.id === item.id);
    if (index >= 0) {
      list.splice(index, 1);
    }
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

  public deleteBrew(event: DeleteBrewEvent) {
    this.openDeleteDialog(event.mouseEvent, event.brew, event.brew.number + ' ' + event.brew.name);
  }

  public closeTab(event: MouseEvent, brew: Brew, index: number) {
    event.stopPropagation();
    this.formSelectedBrew.setValue(0);
    this.selectedBrews.splice(index, 1);
  }
}

class AccordionExtension {
  title: string;
  dataSource: MatTableDataSource<Brew>;
  lastColumn: ValueViewChild;
}
