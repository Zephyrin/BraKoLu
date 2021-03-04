import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BrewDisplayService } from '@app/_services/brew/brew-display.service';
import { BrewService } from '@app/_services/brew/brew.service';
import { Subscription } from 'rxjs';
import { BrewCreateComponent } from '../brew-create/brew-create.component';

@Component({
  selector: 'app-brew-toolbar',
  templateUrl: './brew-toolbar.component.html',
  styleUrls: ['./brew-toolbar.component.scss']
})
export class BrewToolbarComponent implements OnInit, OnDestroy {

  private afterClosedSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    public service: BrewService,
    public serviceDisplay: BrewDisplayService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
  }

  openCreateDialog(event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(BrewCreateComponent, { minWidth: '30em' });
    (dialogRef.componentInstance as unknown as BrewCreateComponent).create();
    this.afterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
      if (this.afterClosedSubscription) { this.afterClosedSubscription.unsubscribe(); }
    });
  }

}
