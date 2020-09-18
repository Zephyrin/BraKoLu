import { FormGroup } from '@angular/forms';
import { FormErrors } from '@app/_helpers/form-error';
import { HttpService } from '@app/_services/http.service';
import { Subject } from 'rxjs';

export interface IService {
  edit: boolean;
  loading: Subject<boolean>;
  form: FormGroup;
  endUpdate: Subject<boolean>;
  load(): void;

  has(name: string, value: any | undefined): boolean;

  hasError(name: string): boolean;
  getError(name: string): string;
  hasErrors(): boolean;

  get(name: string, value: any | undefined): any;

  update(name: string, value: any, newValue: any): void;

  create(): any;

  setForm(form: FormGroup);
}

export abstract class CService<T> implements IService {
  public model: T[];
  public loading = new Subject<boolean>();
  private loadingSource = false;
  public errors = new FormErrors();
  public form: FormGroup;
  public endUpdate = new Subject<boolean>();

  public set edit(edit: boolean) {
    this.edit$ = edit;
  }
  public get edit() { return this.edit$; }
  protected edit$ = false;

  protected workingOn: T;

  public constructor(
    protected http: HttpService<T>
  ) {
    this.edit = false;
  }

  abstract createCpy(value: T): T;
  abstract create(): T;
  public load(): void {
    this.http.getAll(null).subscribe(response => {
      this.model = response.body.map((x) => this.createCpy(x));
      this.end();
    }, err => {
      this.model = [];
      this.end(err);
    });
  }

  public has(name: string, value: T | undefined): boolean {
    return value && value[name];
  }

  public setForm(form: FormGroup) {
    this.form = form;
  }

  public hasError(name: string): boolean {
    return this.errors.hasErrors[name];
  }

  public getError(name: string): string {
    return this.errors.get(name);
  }
  public hasErrors(): boolean {
    return this.errors.hasAtLeastOne;
  }
  public get(name: string, value: any | undefined): any {
    if (value && value[name]) {
      return value[name];
    }
    return undefined;
  }

  public update(name: string, value: T, newValue: any): void {
    if (this.start() === true) {
      this.workingOn = value;
      if (newValue === undefined) {
        this.delete(value);
      } else {
        if (this.workingOn) {
          const id = 'id';
          const model: any = {};
          model[id] = this.workingOn[id];
          model[name] = newValue;
          this.updateOrCreate(model);
        } else {
          this.updateOrCreate(newValue);
        }

      }
    }
  }

  protected start(): boolean {
    if (this.loadingSource === true) { return false; }
    this.loadingSource = true;
    this.loading.next(this.loadingSource);
    this.errors = new FormErrors();
    return true;
  }

  protected end(serverError?: any | undefined) {
    if (serverError) {
      this.errors.formatError(serverError);
      if (this.form) {
        serverError.error.errors.forEach(error => {
          Object.keys(error.children).forEach(prop => {
            const formControl = this.form.get(prop);
            if (formControl && error.children[prop].errors) {
              // activate the error message
              error.children[prop].errors.forEach(message => {
                formControl.setErrors({
                  serverError: message
                });
              });
            }
          });
        });
      }
    } else {
      this.errors = new FormErrors();
      this.workingOn = undefined;
      this.endUpdate.next(true);
    }
    this.loadingSource = false;
    this.loading.next(this.loadingSource);
  }

  protected updateOrCreate(model: T) {
    const name = 'id';
    if (model[name] === undefined || model[name] === '') {
      const dataToSent = this.createCpy(model);
      this.http.create(dataToSent).subscribe(data => {
        this.model.push(this.createCpy(data));
        this.end();
      }, error => {
        this.end(error);
      });
    } else {
      this.http.update(model[name].toString(), model).subscribe(data => {
        this.workingOn = this.createCpy(model);
        this.end();
      }, error => {
        this.end(error);
      });
    }
  }

  protected delete(model: T) {
    const name = 'id';
    if (model[name] !== undefined) {
      this.http.delete(model[name]).subscribe(() => {
        this.sliceWorkingOn();
      }, (error) => {
        if (error.status === 404) {
          this.sliceWorkingOn();
        } else {
          this.end(error);
        }
      });
    } else {
      this.end(undefined);
    }
  }

  protected sliceWorkingOn() {
    const index = this.model.indexOf(this.workingOn);
    if (index >= 0) {
      this.model.splice(index, 1);
    }
    this.end();
  }
}
