import { FormBuilder } from '@angular/forms';
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
import { BrewState } from '@app/_mapper/brew/brew-state';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

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
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false } }
  ],
})
export class BrewDetailsDesktopComponent implements OnInit, OnDestroy {
  private serviceEndUpdateSubscription: Subscription;

  public states = new Array<BrewState>();

  public indexCurrentBrew = 0;
  @Input() set brew(value: Brew) {
    this.$brew = value;
  }
  get brew() { return this.$brew; }

  private $brew: Brew;

  @ViewChild('stepper') stepperComponent: MatStepper;

  constructor(
    public service: BrewService,
    public ingredientService: IngredientService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.endUpdate(undefined);
    this.serviceEndUpdateSubscription = this.service.endUpdate.subscribe(data => {
      this.endUpdate(data);
    });
  }

  ngOnDestroy(): void {
    if (this.serviceEndUpdateSubscription) { this.serviceEndUpdateSubscription.unsubscribe(); }
  }

  endUpdate(data: SimpleChange) {
    if (data === undefined) {
      if (this.service.states !== undefined && this.service.states.length > 0) {
        // Les états du brassin ne peuvent pas changer en cours de route. On initialise
        // les états qu'une seule fois.
        if (this.states.length === 0) {
          const indexCurrentBrew = this.service.states.findIndex(
            x => x.value === this.brew.state);
          let index = 0;
          this.service.states.forEach(state => {
            this.states.push(
              new BrewState(state, this.formBuilder, index < indexCurrentBrew, index === indexCurrentBrew)
            );
            index++;
          });
          this.indexCurrentBrew = indexCurrentBrew;
          //      this.udpateCurrentStep(indexCurrentBrew);
        }
      }
    } else if (data.previousValue !== null && data.previousValue !== undefined) {
      if (data.previousValue.id === this.brew.id && data.currentValue) {
        if (this.brew.state !== data.previousValue.state) {
        }
      }
    }
  }

  udpateCurrentStep(indexBrew: number) {
    const interval = setInterval(() => {
      if (this.indexCurrentBrew < indexBrew) {
        this.indexCurrentBrew++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  isCompleteState(state: string) {
    const indexState = this.service.states.findIndex(x => x.value === state);
    const indexBrew = this.service.states.findIndex(x => x.value === this.brew.state);
    return indexState <= indexBrew;
  }

  test(brewState: BrewState) {
    return brewState.isDone;
  }
}
