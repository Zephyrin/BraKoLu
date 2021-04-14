import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockDisplayService {

  public filterExpanded = true;

  private isViewTableP = true;
  public get isViewTable() { return this.isViewTableP; }

  private isViewListP = false;
  public get isViewList() { return this.isViewListP; }

  constructor() { }

  public viewTable(): void {
    this.isViewListP = false;
    this.isViewTableP = true;
  }

  public viewList(): void {
    this.isViewListP = true;
    this.isViewTableP = false;
  }
}
