import { ISearch } from './isearch';
import { ISortable, Sortable } from './isort';
import { IPaginate, Paginate } from './ipaginate';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormErrors } from '@app/_helpers/form-error';
import { HttpService } from '@app/_services/http.service';
import { Subject } from 'rxjs';
import { SimpleChange } from '@angular/core';

export interface IService {
  /**
   * Permet de savoir si l'interface est en mode édition ou non.
   */
  edit: boolean;
  /**
   * Permet de savoir si l'interface est doit fichier les données pour cause de chargement.
   * Lors de l'initialisation, d'une création, d'une mise à jour ou d'une suppression.
   */
  loading: Subject<boolean>;

  /**
   * La valeur direct de loading sans avoir à l'observer.
   */
  loadingSource: boolean;
  /**
   * Les données sous forme de tableau.
   */
  model: any;
  /**
   * Le formulaire de création.
   */
  form: FormGroup;
  /**
   * Permet de dire à l'interface que la création, mise à jour ou la suppression est terminée
   * et qu'il peut mettre à jour la vue.
   * Si SimpleChange est null, cela signifie que c'est le chargement qui a terminé.
   * Sinon on a les informations qui sont remontées au travers de cette classe.
   */
  endUpdate: Subject<SimpleChange>;

  /**
   * Permet de gérer la pagination de la liste de données.
   */
  paginate: IPaginate;

  /**
   * Permet de gérer l'entête des tables pour trier par le nom de la colonne.
   */
  sort: ISortable;

  /**
   * Permet de gérer la recherche ou de créer des filtres d'affichage.
   */
  search: ISearch;

  /**
   * La liste des entêtes pour les tableaux.
   */
  headers: ValueViewChild[];

  /**
   * La liste des entêtes à afficher pour les tableaux.
   */
  displayedColumns: string[];

  /**
   * Permet de sélectionner un élément du model.
   */
  selected: any;

  /**
   * Charge l'intégralité des données, utilisé par défaut.
   * On peut aussi lui donner des paramètres de pagination afin de ne sélectionner qu'un partie de celles-ci.
   */
  load(all: boolean): void;

  /**
   * Initialise les enums du service. Comme par example la liste des types céréales ou leurs formats.
   */
  initEnums(): void;

  /**
   * Détermine si un attribut est présent dans un objet value.
   *
   * @param name Le nom de l'attribut que l'on cherche dans l'objet value
   * @param value L'objet qui doit-être présent dans la liste.
   */
  has(name: string, value: any | undefined): boolean;

  /**
   * Détermine si un attribut est en erreur ou non dans le formulaire form.
   *
   * @param name Le nom de l'attribut potentielement en erreur.
   */
  hasError(name: string): boolean;

  /**
   * Récupère l'erreur de l'attribut name dans le formulaire form.
   *
   * @param name Le nom de l'attribut qui possède une erreur.
   */
  getError(name: string): string;

  /**
   * Retourne true si le formulaire possède une erreur.
   */
  hasErrors(): boolean;

  /**
   * Récupère l'attribut name de l'objet value. Correspond à value->name.
   *
   * @param name Le nom de l'attribut que l'on cherche dans value.
   * @param value L'objet qui doit possèder l'attribut name.
   */
  get(name: string, value: any | undefined): any;

  /**
   * Récupère l'attribut name de l'objet value pour l'afficher. Correspond à value->name | date: 'Y'.
   * Ou encore hopType[value->name]->viewValue.
   * Permet d'afficher la valeur à afficher plutôt que la clef.
   * @param name Le nom de l'attribut que l'on cherche dans value.
   * @param value L'objet qui doit possèder l'attribut name.
   */
  getDisplay(name: string, value: any | undefined): any;

  /**
   *
   * @param name Le nom de l'attribut qui sera mis à jour.
   * @param value L'objet à mettre à jour.
   * @param newValue La nouvelle valeur que prendra l'attribut name dans l'objet value.
   */
  update(name: string, value: any, newValue: any): void;

  /**
   * Crée une instance d'un objet. À définir pour chaque classe qui instancie celle-ci.
   */
  create(): any;

  /**
   * Crée une instance pour réaliser un udpate partiel de l'objet.
   */
  createPart(): any;

  /**
   * Créer le formulaire de création ou de mise à jour.
   *
   * @param formBuilder Le créateur de formulaire donné par la vue. Permet de définir les champs qui seront suivis
   * par le formulaire.
   * @param value La valeur en question (permet de réaliser un update ou une création par copie)
   */
  createForm(formBuilder: FormBuilder, value: any);

  /**
   * Supprime le formulaire à la fin de l'utilisation.
   */
  deleteForm();

  /**
   * Recherche dans un tableau de ValueViewChild la valeur et retourne la valeur de la vue.
   */
  findInValueViewChild(valueViewChild: ValueViewChild[], value: string): string;

  /**
   * Change l'élément sélectionné.
   */
  setSelected(value: any): void;
}

export interface ValueViewChild {
  value: string;
  viewValue: string;
}

export abstract class CService<T> implements IService {
  //#region Attributes IService
  public model: T[];
  public selected: T;
  public loading = new Subject<boolean>();
  public loadingSource = false;
  public errors = new FormErrors();
  public form: FormGroup;
  public endUpdate = new Subject<SimpleChange>();
  public headers: ValueViewChild[] = [];
  public displayedColumns: string[] = [];

  public set edit(edit: boolean) {
    this.edit$ = edit;
  }
  public get edit() { return this.edit$; }
  protected edit$ = false;

  protected workingOn: T;
  //#endregion
  //#region Attributes IPaginate
  public paginate = new Paginate();
  //#endregion
  //#region Sort ISort
  public sort = new Sortable();
  //#endregion
  //#region Search
  public search: ISearch;
  //#endregion
  protected initEnumDone = new Subject<boolean>();
  private loadAll = false;
  public constructor(
    protected http: HttpService<T>,
    private $search: ISearch | undefined
  ) {
    this.edit = false;
    this.paginate.changePageSubject.subscribe(x => {
      if (x === true) {
        this.load();
      }
    });
    this.sort.changePageSubject.subscribe(x => {
      if (x === true) {
        this.load();
      }
    });
    this.search = $search;
    if (this.search) {
      this.search.changePageSubject.subscribe(x => {
        if (x === true) {
          this.load();
        }
      });
    }
    this.initEnumDone.subscribe(x => {
      if (x === true) {
        this.load$();
      }
    });
  }

  //#region Abstract IService
  abstract createCpy(value: T): T;
  abstract create(): T;
  abstract createPart(): T;
  public abstract createFormBasedOn(formBuilder: FormBuilder, value: T);

  public abstract initEnums();

  public abstract getDisplay(name: string, value: T): any;
  //#endregion
  public load(all: boolean = false): void {
    this.loadAll = all;
    this.start();
    this.initEnums();
  }

  private load$(): void {
    let httpParams = null;
    if (this.search) {
      httpParams = this.search.initSearchParams(httpParams);
    }
    if (!this.loadAll) {
      httpParams = this.paginate.initPaginationParams(httpParams);
      httpParams = this.sort.initSortParams(httpParams);
    }
    this.http.getAll(httpParams).subscribe(response => {
      this.paginate.setParametersFromResponse(response.headers);
      this.model = response.body.map((x) => this.createCpy(x));
      this.end(true, undefined);
    }, err => {
      this.model = [];
      this.end(true, undefined, err);
    });
  }
  //#region IService
  public has(name: string, value: T | undefined): boolean {
    return value && value[name];
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

  public update(name: string, value: T, newValue: any, update = false, forceCall = false): void {
    if (this.start() === true || forceCall) {
      this.workingOn = value;
      const simpleChange = new SimpleChange(value, newValue, true);
      if ((newValue === undefined || newValue === null) && (name === undefined || name === null)) {
        this.delete(simpleChange);
      } else {
        if (this.workingOn) {
          const id = 'id';
          if ((newValue && newValue[id] || !name) && !update) {
            // On utilise le mode avec l'objet entier.
            simpleChange.currentValue = this.createCpy(newValue);
            this.updateOrCreate(simpleChange);
          } else {
            // On utilise qu'une partie de l'objet.
            const model = this.createPart();
            model[id] = this.workingOn[id];
            model[name] = newValue;
            simpleChange.currentValue = model;
            this.updateOrCreate(simpleChange);
          }
        } else {
          this.updateOrCreate(simpleChange);
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

  protected end(wasUpdate: boolean, change: SimpleChange | undefined, serverError?: any | undefined) {
    if (serverError) {
      this.errors.formatError(serverError);
      if (this.form && serverError.error?.errors) {
        serverError.error.errors.forEach(error => {
          Object.keys(error.children).forEach(prop => {
            const formControl = this.form.get(prop);
            if (formControl && error.children[prop].errors) {
              // activate error message
              error.children[prop].errors.forEach(message => {
                formControl.setErrors({
                  serverError: message
                });
              });
            }
          });
        });
      }
    } else if (wasUpdate) {
      this.errors = new FormErrors();
      this.workingOn = undefined;
      this.endUpdate.next(change);
    }
    this.loadingSource = false;
    this.loading.next(this.loadingSource);
  }

  protected updateOrCreate(simpleChange: SimpleChange) {
    const name = 'id';
    const model = simpleChange.currentValue;
    if (model[name] === undefined || model[name] === '') {
      const dataToSent = this.createCpy(model);
      this.http.create(dataToSent).subscribe(data => {
        // On met à jour sur l'ancienne valeur l'id pour le retrouver plus facilement
        // lors des recherches. Pas sûr d'en avoir besoin.
        // simpleChange.previousValue[name] = data[name];
        simpleChange.currentValue = this.createCpy(data);
        this.model.push(simpleChange.currentValue);
        this.end(true, simpleChange);
      }, error => {
        this.end(true, simpleChange, error);
      });
    } else {
      this.http.update(model[name].toString(), model).subscribe(data => {
        const newValue = simpleChange.previousValue;
        simpleChange.previousValue = this.createCpy(simpleChange.previousValue);
        this.updateData(data, newValue, model);

        simpleChange.currentValue = newValue;
        this.end(true, simpleChange);
      }, error => {
        this.end(true, simpleChange, error);
      });
    }
  }

  protected updateData(newData: T, oldData: T, modelUsedForUpdate: T) {
    if (newData) {
      Object.keys(newData).forEach(key => {
        oldData[key] = newData[key];
      });
    } else {
      Object.keys(modelUsedForUpdate).forEach(key => {
        if (key !== 'id') {
          oldData[key] = modelUsedForUpdate[key];
        }
      });
    }
  }

  protected delete(simpleChange: SimpleChange) {
    const name = 'id';
    const model = simpleChange.previousValue;
    if (model[name] !== undefined) {
      this.http.delete(model[name]).subscribe(() => {
        this.sliceWorkingOn(simpleChange);
      }, (error) => {
        if (error.status === 404) {
          this.sliceWorkingOn(simpleChange);
        } else {
          this.end(true, simpleChange, error);
        }
      });
    } else {
      this.end(true, simpleChange, undefined);
    }
  }

  protected sliceWorkingOn(simpleChange: SimpleChange) {
    const index = this.model.indexOf(this.workingOn);
    if (index >= 0) {
      this.model.splice(index, 1);
    }
    this.end(true, simpleChange);
  }

  public createForm(formBuilder: FormBuilder, value: T): void {
    this.createFormBasedOn(formBuilder, value);
    this.patchValue(value);
  }

  protected patchValue(value: T): void {
    this.form.patchValue(value);
  }

  public deleteForm(): void {
    this.form = undefined;
  }
  //#endregion
  public findInValueViewChild(valueViewChild: ValueViewChild[], value: any): string {
    const find = valueViewChild.find(elt => elt.value === value);
    if (find) {
      return find.viewValue;
    }
    return undefined;
  }

  public setSelected(value: T): void {
    this.selected = value;
  }
}
