import { HttpClient } from '@angular/common/http';
import { HttpService } from '@app/_services/http.service';
import { Injectable } from '@angular/core';
import { Brew } from '@app/_models/brew';

@Injectable({
  providedIn: 'root'
})
export class BrewHttpService extends HttpService<Brew>{

  private path = 'brew';
  private pathAll = 'brews';

  constructor(protected http: HttpClient) {
    super(http);
  }

  createPath() { return this.path; }

  getAllPath() { return this.pathAll; }

  getPath() { return this.path; }

  updatePath() { return this.path; }

  deletePath() { return this.path; }
}
