import { SupplierService } from '@app/_services/supplier/supplier.service';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, HostBinding, Input, Output, OnDestroy, Optional, Self, ElementRef } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Supplier } from '@app/_models';
import { Subject } from 'rxjs';
import { SupplierSelectDialogComponent } from '../supplier-select-dialog/supplier-select-dialog.component';
import { TryCatchStmt } from '@angular/compiler';

@Component({
  selector: 'app-supplier-select-input',
  templateUrl: './supplier-select-input.component.html',
  styleUrls: ['./supplier-select-input.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: SupplierSelectInputComponent }],
})
export class SupplierSelectInputComponent implements
  MatFormFieldControl<Supplier>,
  OnDestroy,
  ControlValueAccessor {
  static nextId = 0;
  @HostBinding() id = `supplier-select-input-${SupplierSelectInputComponent.nextId++}`;
  @Output() newSupplier = new EventEmitter<Supplier>();

  valueP: Supplier;
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
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

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
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled = false;

  errorState = false;
  controlType = 'supplier-select-input';
  @Input('aria-describedby') describedBy = '';
  autofilled?: boolean;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    public dialog: MatDialog,
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    @Optional() public parentFormField: MatFormField,
    private service: SupplierService) {
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
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'button') {
      this.select();
    }
  }

  select() {
    if (!this.disabled) {
      const dialogRef = this.dialog.open(SupplierSelectDialogComponent, { minWidth: '50em', data: this.value });
      /* (dialogRef.componentInstance as unknown as SupplierSelectDialogComponent).supplierService = this.service; */
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.value = result;
          this.newSupplier.emit(this.value);
        }
      });
    }
  }

  deleteSupplier(evt: MouseEvent) {
    evt.stopPropagation();
    evt.preventDefault();
    if (!this.disabled) {
      this.value = undefined;
    }
  }

}
