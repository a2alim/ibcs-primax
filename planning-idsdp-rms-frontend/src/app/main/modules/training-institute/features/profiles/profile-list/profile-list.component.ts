import { Component, OnInit } from '@angular/core';
import {addNewIcon, viewIcon} from '../../../constants/button.constants';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import { locale as lngEnglish } from '../i18n/en';
import { locale as lngBangla } from '../i18n/bn';
import {DEFAULT_SIZE} from "../../../../../core/constants/constant";
import {PageEvent} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {TrainingInstituteProfileService} from "../../../services/training-institute-profile.service";

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent implements OnInit {

    displayedColumns: string[] = [
        'position',
        'trainingInstituteName',
        'headOfInstituteName',
        'designation',
        'email',
        'mobileNumber',
        /* 'proposal_info',*/ 'action',
    ];
    dataSource: any;
    dataList: any;
    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };
    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;
    userList: any[] = [];
    userDetails: any;
    spinner:boolean=false;

    /*----Button---*/
    addNewIcon = addNewIcon;
    viewIcon = viewIcon;
    /*----/Button---*/

  constructor( private _route: Router,
               private toastr: ToastrService,
               private _fuseTranslationLoaderService: FuseTranslationLoaderService,
               private _trainingInstituteProfileService: TrainingInstituteProfileService,
              ) {
      // Language translations
      this._fuseTranslationLoaderService.loadTranslations(
          lngEnglish,
          lngBangla
      );
  }

  ngOnInit(): void {
      this.getListOfResearcherProfile();

  }


    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListOfResearcherProfile();
    }

    private getListOfResearcherProfile() {
        this.spinner=true
        this._trainingInstituteProfileService.getTrainingInstituteListPagable(this.page, this.pageSize).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.page ? res.page.content : []);
            this.totalElements = res.page ? res.page.totalElements : 0;
        });
        this.spinner=false

    }


    showProfileOnlyResearcher(data: any) {
        this._route.navigate([
            'researcher-profile-information/' + data.uuid + '/' + data.id + '/' + data.isInstitutional + '/view',
        ]);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    showProfile(element: any) {
      this._route.navigate(['/profile/' + '739bc694-b2dd-43b5-ab2c-925aac9075bf$'+element.userId])
    }
}
