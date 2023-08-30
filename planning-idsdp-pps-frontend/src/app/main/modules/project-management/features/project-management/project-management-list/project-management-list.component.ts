import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { FormControl, FormGroup } from '@angular/forms';
import { DppTappApproveProjectListService } from 'app/main/modules/rdpp-rtapp-management/services/dpp-tapp-approve-project-list.service';
import { filter } from 'lodash';
import {UserGroupService} from "../../../../configuration-management/services/user-group.service";

@Component({
  selector: 'app-project-management-list',
  templateUrl: './project-management-list.component.html',
  styleUrls: ['./project-management-list.component.scss']
})
export class ProjectManagementListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: MatTable<any>;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['sl', 'projectTitleEn', 'dppTappType', 'priority', 'dateCommencement', 'dateCompletion', 'pdName', 'action'];

  form: any;
  total: number;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router,
    private userGroupService: UserGroupService,
    private dppTappApproveProjectListService: DppTappApproveProjectListService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
  }

  ngOnInit(): void {
    this.populateForm();
    this.getUserGroup();
  }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.getUserInfoByUserId(res.res.userId);
        })
    }

    getUserInfoByUserId(userId) {
        this.userGroupService.geUserInfoByUserId(userId).subscribe(res => {
            this.getApproveDppTappProjectList(res.agency.id);
        })
    }

    getApproveDppTappProjectList(agencyId) {
    this.dppTappApproveProjectListService.getApproveDppTappList(agencyId).subscribe(
      res => {
        this.total = res.res.length;
        this.dataSource = new MatTableDataSource(res.res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    )
  }

  searchByCriteria() {
    this.dataSource.filter = this.form.value.projectType.trim().toLowerCase();
  }

  private populateForm(): void {
    this.form = new FormGroup({
      projectType: new FormControl(''),
      sectorDivision: new FormControl(''),
      fundingType: new FormControl(''),
      projectName: new FormControl(''),
      sector: new FormControl(''),
      lowAmount: new FormControl(''),
      highAmount: new FormControl(''),
      type: new FormControl(''),
    });
  }

  goToProjectManagementDetails(data) {

   // this.router.navigate([`project-management/pd-selection/${data.id}/${data.uuid}/${data.projectConceptMasterId}/${data.projectConceptUuid}/${data.dppTappType}/${data.projectConceptMasterId}`]);
    this.router.navigate([`project-management/pd-selection/${data.id}/${data.uuid}/${data.projectConceptMasterId}/${data.projectConceptUuid}/${data.dateCommencement}/${data.dateCompletion}/${data.dppTappType}`]);

    // if (this.actionPermission?.includes('View Dpp Tapp Dashboard')) {
    //   this.router.navigate([`dpp-tapp/view-dashboard/${row.uuid}`]);
    // }
  }

  clearSearchForm() {
    this.form.reset();
    this.populateForm();
    this.searchByCriteria();
  }

}
