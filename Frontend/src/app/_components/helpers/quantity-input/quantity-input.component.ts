import { Ingredient } from '@app/_models';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Component, OnDestroy, HostBinding, Output, EventEmitter, Input, ElementRef, Optional, Self } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-quantity-input',
  templateUrl: './quantity-input.component.html',
  styleUrls: ['./quantity-input.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: QuantityInputComponent }],
})
export class QuantityInputComponent implements
  MatFormFieldControl<number>,
  OnDestroy,
  ControlValueAccessor {
  static nextId = 0;
  @HostBinding() id = `quantity-input-${QuantityInputComponent.nextId++}`;

  @Input() unit: string;
  @Input() unitFactor = 1;

  @Input() set ingredient(ing: Ingredient) {
    if (ing) {
      this.unit = ing.unit;
      if (ing.unitFactor > 0) { this.unitFactor = ing.unitFactor; }
    }
  }

  get step() {
    return 1 / this.unitFactor;
  }
  get quantity() {
    return this.valueP / this.unitFactor;
  }
  valueP: number;
  @Input('value') set value(val) {
    this.valueP = Math.round(val);
  }

  get value() {
    return this.valueP;
  }

  @Output() changed = new EventEmitter<number>();

  stateChanges = new Subject<void>();

  @Input()
  get placeholder() {
    return this.$placeholder;
  }
  set placeholder(plh) {
    this.$placeholder = plh;
    this.stateChanges.next();
  }
  private $placeholder: string;

  focused = false;
  get empty(): boolean {
    return this.value === undefined || this.value === null;
  }
  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @Input()
  get required(): boolean {
    return this.$required;
  }
  set required(req) {
    this.$required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private $required = false;

  @Input()
  get disabled(): boolean { return this.$disabled; }
  set disabled(value: boolean) {
    this.$disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private $disabled = false;

  errorState = false;
  controlType = 'price-input';
  @Input('aria-describedby') ariaDescribedby = '';

  autofilled?: boolean;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    @Optional() public parentFormField: MatFormField) {
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
    fm.monitor(elRef, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDescribedByIds(ids: string[]): void {
    this.ariaDescribedby = ids.join(' ');
  }

  onChangeEvent(event: any): void {
    this.value = event.target.value * this.unitFactor;
    this.stateChanges.next();
    this.onChange(this.valueP);
    this.onTouched();
    this.changed.emit(this.valueP);
  }

}
