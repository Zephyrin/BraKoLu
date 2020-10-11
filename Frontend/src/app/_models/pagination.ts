export class Pagination {
  public totalCount = 1;
  public paginationCount = 1;
  public paginationPage = 1;
  public set paginationLimit(value: number) {
    this.paginationLimit$ = value;
    localStorage.setItem('pagination_limit', JSON.stringify(value));
  }
  public get paginationLimit() { return this.paginationLimit$; }
  private paginationLimit$ = 10;
  public lastPage = 1;
  public firstPage = 1;

  public constructor() {
    const limit = localStorage.getItem('pagination_limit');
    if (limit !== undefined && limit !== null) {
      this.paginationLimit = JSON.parse(limit);
    }
  }
}
