import { Subscription } from 'rxjs';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { BrewService } from '@app/_services/brew/brew.service';
import { Brew } from '@app/_models/brew';
import { Component, Input, OnInit, ViewChild, AfterViewInit, SimpleChange, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-brew-details-desktop',
  templateUrl: './brew-details-desktop.component.html',
  styleUrls: ['./brew-details-desktop.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class BrewDetailsDesktopComponent implements OnInit, AfterViewInit, OnDestroy {
  private serviceEndUpdateSubscription: Subscription;
  @Input() set brew(value: Brew) {
    this.$brew = value;
  }
  get brew() { return this.$brew; }

  private $brew: Brew;

  @ViewChild('stepper') stepperComponent: MatStepper;

  constructor(
    public service: BrewService,
    public ingredientService: IngredientService
  ) { }

  ngOnInit(): void {
    this.serviceEndUpdateSubscription = this.service.endUpdate.subscribe(data => {
      this.endUpdate(data);
    });
  }

  ngAfterViewInit(): void {
    // On passe par la vue en bindant le status completed du step si c'est celui du brassin.
    //this.stepperComponent.selectedIndex = this.service.states.findIndex(x => x.value === this.brew.state);
  }

  ngOnDestroy(): void {
    if (this.serviceEndUpdateSubscription) { this.serviceEndUpdateSubscription.unsubscribe(); }
  }

  endUpdate(data: SimpleChange) {
    if (data.previousValue !== null && data.previousValue !== undefined) {
      if (data.previousValue.id === this.brew.id && data.currentValue) {
        if (this.brew.state !== data.previousValue.state) {
        }
      }
    }
  }

  updateStartedDate(event: any) {
    this.updateDate(event, 'started');
  }
  updateEndedDate(event: any) {
    this.updateDate(event, 'ended');
  }
  updateDate(event: any, date: string) {
    if (event.target.value) {
      this.service.update(date, this.$brew, new Date(event.target.value));
    } else {
      this.service.update(date, this.$brew, null);
    }

  }

  deleteDate(event: MouseEvent, date: string) {
    this.service.update(date, this.$brew, null);
  }

  isCompleteState(state: string) {
    const indexState = this.service.states.findIndex(x => x.value === state);
    const indexBrew = this.service.states.findIndex(x => x.value === this.brew.state);
    return indexState <= indexBrew;
  }
}
