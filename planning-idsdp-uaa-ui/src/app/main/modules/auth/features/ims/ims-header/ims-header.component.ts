import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ims-header',
  templateUrl: './ims-header.component.html',
  styleUrls: ['./ims-header.component.scss']
})
export class ImsHeaderComponent implements OnInit {

  @Input() title?: string;
  @Input() subTitle?: string;
  navigateUrl: string;

  constructor() { }

  ngOnInit(): void {

  }

  goBackToHome() {
    window.history.back();
  }

}
