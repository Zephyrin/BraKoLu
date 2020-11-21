import { BrewService } from '@app/_services/brew/brew.service';
import { Brew } from '@app/_models/brew';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-brew-details-desktop',
  templateUrl: './brew-details-desktop.component.html',
  styleUrls: ['./brew-details-desktop.component.scss']
})
export class BrewDetailsDesktopComponent implements OnInit {
  @Input() brew: Brew;

  constructor(
    public service: BrewService
  ) { }

  ngOnInit(): void {
  }

}
