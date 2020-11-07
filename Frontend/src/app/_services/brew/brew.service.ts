import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { BrewHttpService } from './brew-http.service';
import { CService, ValueViewChild } from '@app/_services/iservice';
import { Injectable } from '@angular/core';
import { Brew } from '@app/_models/brew';

@Injectable({
  providedIn: 'root'
})
export class BrewService extends CService<Brew> {
  public states: ValueViewChild[] = [];
  private nbEnumLeft = 0;
  constructor(
    private h: BrewHttpService,
    public datepipe: DatePipe) {
    super(h, undefined);
  }

  public initEnums(): void {
    this.nbEnumLeft = 0;
    if (this.states.length === 0) {
      this.nbEnumLeft++;
      this.h.getEnum('states').subscribe(response => {
        response.forEach(elt => {
          this.states.push(elt);
        });
        this.nbEnumLeft--;
        if (this.nbEnumLeft <= 0) {
          this.initEnumDone.next(true);
        }
      });
    }
    if (this.headers.length === 0) {
      this.nbEnumLeft++;
      this.h.getEnum('headers').subscribe(response => {
        response.forEach(elt => {
          this.headers.push(elt);
          this.displayedColumns.push(elt.value);
        });
        this.nbEnumLeft--;
        if (this.nbEnumLeft <= 0) {
          this.initEnumDone.next(true);
        }
      });
    }
    if (this.nbEnumLeft <= 0) {
      this.initEnumDone.next(true);
    }
  }

  public create(): Brew {
    return new Brew(undefined);
  }

  public createCpy(brew: Brew): Brew {
    return new Brew(brew);
  }

  public createFormBasedOn(formBuilder: FormBuilder, value: Brew): void {
    this.form = formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      abv: ['', Validators.required],
      ibu: ['', Validators.required],
      ebc: ['', Validators.required],
      state: ['', Validators.required],
      producedQuantity: [''],
      started: [''],
      ended: [''],
    });
  }

  public getDisplay(name: string, value: Brew): any {
    switch (name) {
      case 'state':
        return this.findInValueViewChild(this.states, value[name]);
      case 'created':
      case 'ended':
      case 'started':
        return this.datepipe.transform(value[name], 'y-MM-dd');
      default:
        break;
    }
    return value[name];
  }
}
