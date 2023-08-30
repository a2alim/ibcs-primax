import { Component, OnInit } from '@angular/core';
import {environment} from "../../../../../../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {FuseNavigationService} from "../../../../../../../@fuse/components/navigation";

@Component({
  selector: 'app-gis-map-dashboard',
  templateUrl: './gis-map-dashboard.component.html',
  styleUrls: ['./gis-map-dashboard.component.scss']
})
export class GisMapDashboardComponent extends UnsubscribeAdapterComponent implements OnInit {

    gisUrl: any;
    toggleMenuBarPreviousValue: any;

  constructor(private sanitizer : DomSanitizer,
              private route: Router,
              private _fuseNavigationService: FuseNavigationService) {
      super();
      this.toggleMenuBar(false);
  }

  ngOnInit(): void {
      this.getGisMapUrl();
  }

    getGisMapUrl() {
        this.gisUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(environment.ibcs.gisUrl+'gisDashboard?access_token='+sessionStorage.getItem('access_token'));
    }

    navigateToDashboard() {
        this.toggleMenuBar(this.toggleMenuBarPreviousValue);
        this.route.navigate([`dashboard`]);
    }

    // collapsed menue bar
    toggleMenuBar(value: boolean){
        const navigation = this._fuseNavigationService.getComponent('mainNavigation');
        if (navigation) {
            this.toggleMenuBarPreviousValue = navigation.opened;
            navigation.opened = value;
        }
    }
}
