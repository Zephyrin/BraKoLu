import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, HostBinding, Input, Output, OnDestroy, Optional, Self, ElementRef } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Ingredient } from '@app/_models';
import { IngredientService } from '@app/_services/ingredient/ingredient.service';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { IngredientSelectDialogComponent } from '../ingredient-select-dialog/ingredient-select-dialog.component';

@Component({
  selector: 'app-ingredient-select-input',
  templateUrl: './ingredient-select-input.component.html',
  styleUrls: ['./ingredient-select-input.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: IngredientSelectInputComponent }],
})
export class IngredientSelectInputComponent implements
  MatFormFieldControl<Ingredient>,
  OnDestroy,
  ControlValueAccessor {
  static nextId = 0;
  @HostBinding() id = `ingredient-select-input-${IngredientSelectInputComponent.nextId++}`;
  @Output() newSupplier = new EventEmitter<Ingredient>();

  valueP: Ingredient;
  @Input('value') set value(val) {
    this.valueP = val;
    this.stateChanges.next();
    this.onChange(val);
    this.onTouched();
  }
  get value() {
    return this.valueP;
  }

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
  controlType = 'supplier-select-input';
  @Input('aria-describedby') ariaDescribedby = '';
  autofilled?: boolean;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    public dialog: MatDialog,
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    @Optional() public parentFormField: MatFormField,
    private service: IngredientService) {
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
    fm.monitor(elRef, true).subscribe({
      next: origin => {
        this.focused = !!origin;
        this.stateChanges.next();
      }
    });
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

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'button') {
      this.select();
    }
  }

  select() {
    if (!this.disabled) {
      const dialogRef = this.dialog.open(IngredientSelectDialogComponent, { minWidth: '50em', data: this.value });
      /* (dialogRef.componentInstance as unknown as SupplierSelectDialogComponent).supplierService = this.service; */
      dialogRef.afterClosed().pipe(first())
        .subscribe({
          next: result => {
            if (result) {
              this.value = result;
              this.newSupplier.emit(this.value);
            }
          }
        });
    }
  }

  deleteIngredient(evt: MouseEvent) {
    evt.stopPropagation();
    evt.preventDefault();
    if (!this.disabled) {
      this.value = undefined;
    }
  }

}
