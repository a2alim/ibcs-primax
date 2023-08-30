import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-compare-report',
  templateUrl: './compare-report.component.html',
  styleUrls: ['./compare-report.component.scss']
})
export class CompareReportComponent implements OnInit {

  authId: string = "OLCLeG-test";
  url: string = "https://api.draftable.com/v1/comparisons/viewer/" + this.authId + "/";
  urlSafe: SafeResourceUrl;
  identifier: string;
  // url: string = "https://api.draftable.com/v1/comparisons/viewer/oUhVal-test/";
  newUrl: string;
  constructor(
      private activatedRoute: ActivatedRoute,
      public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
      this.identifier = this.activatedRoute.snapshot.params['id'];
      this.newUrl = this.url + this.identifier;
      this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.newUrl);
  }

}
