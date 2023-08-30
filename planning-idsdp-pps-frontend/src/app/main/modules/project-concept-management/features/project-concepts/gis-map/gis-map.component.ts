import { Component, OnInit } from '@angular/core';
import {UnsubscribeAdapterComponent} from "../../../../../core/helper/unsubscribeAdapter";
import {AgencyDashboardService} from "../../../services/agency-dashboard.service";

@Component({
  selector: 'app-gis-map',
  templateUrl: './gis-map.component.html',
  styleUrls: ['./gis-map.component.scss']
})
export class GisMapComponent extends UnsubscribeAdapterComponent implements OnInit {

    division: any = {};

  constructor(private agencyDashboardService: AgencyDashboardService) {
      super();
  }

  ngOnInit(): void {
      this.loadLocationData();
  }


    private loadLocationData() {
        this.subscribe$.add(
            this.agencyDashboardService.getLocationData().subscribe(res => {
                this.division = res.division;
            })
        );
    }
}
