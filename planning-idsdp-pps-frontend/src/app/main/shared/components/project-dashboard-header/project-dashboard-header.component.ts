import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-dashboard-header',
  templateUrl: './project-dashboard-header.component.html',
  styleUrls: ['./project-dashboard-header.component.scss']
})
export class ProjectDashboardHeaderComponent implements OnInit {

    @Input() title?: string;
    @Input() subTitle?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
