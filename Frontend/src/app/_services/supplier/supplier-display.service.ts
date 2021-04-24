import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupplierDisplayService {
  public filterExpanded = true;

  private isViewTableP = true;
  public get isViewTable() { return this.isViewTableP; }

  private isViewListP = false;
  public get isViewList() { return this.isViewListP; }
  private configName?: string;
  constructor() {
    this.loadOtherConfig();
  }

  public loadOtherConfig(config?: string) {
    this.configName = config;
    const view = localStorage.getItem(this.getKey());
    if (view !== undefined && view !== null) {
      if (view === 'table') {
        this.viewTable();
      } else if (view === 'list') {
        this.viewList();
      }

    }
  }

  public viewTable(): void {
    this.isViewListP = false;
    this.isViewTableP = true;
    localStorage.setItem(this.getKey(), 'table');
  }

  public viewList(): void {
    this.isViewListP = true;
    this.isViewTableP = false;
    localStorage.setItem(this.getKey(), 'list');
  }

  private getKey(): string {
    return 'supplierDisplay-view' + (this.configName ? '-' + this.configName : '') + '-type';
  }
}
