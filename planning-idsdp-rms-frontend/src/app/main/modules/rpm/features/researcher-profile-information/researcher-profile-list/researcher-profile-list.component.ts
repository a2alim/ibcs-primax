import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import { ToastrService } from 'ngx-toastr';
import { DEFAULT_SIZE } from '../../../../../core/constants/constant';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import {
    SubmitConfirmationDialogComponent
} from '../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from '../../../../../shared/constant/confirm.dialog.constant';
import { AuthService } from '../../../../auth/services/auth.service';
import { addNewIcon } from '../../../constants/button.constants';
import { ResearchProfileListModel } from '../../../models/ResearchProfileListModel';
import { ResearchProfileMultiFormService } from '../../../services/research-profile-multi-form.service';
import { locale as lngBangla } from '../i18n/bn';
import { locale as lngEnglish } from '../i18n/en';
import {
    ResearcherProposalListModalComponent
} from './researcher-proposal-list-modal/researcher-proposal-list-modal.component';

@Component({
    selector: 'app-researcher-profile-list',
    templateUrl: './researcher-profile-list.component.html',
    styleUrls: ['./researcher-profile-list.component.scss'],
})
export class ResearcherProfileListComponent implements OnInit {
    displayedColumns: string[] = [
        'position',
        'name',
        'reg_no',
        'mobile_no',
        /* 'proposal_info',*/ 'action',
    ];
    dataSource: any;
    dataList: ResearchProfileListModel[] = new Array();
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
    spinner:boolean=false

    /*----Button---*/
    addNewIcon = addNewIcon;

    /*----/Button---*/

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private _dialog: MatDialog,
        private _authService: AuthService,
        private userListService: UserListServiceService,
        private _route: Router,
        private toastr: ToastrService,
        private StorageService: StorageService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.userDetails = this.StorageService.getUserData();
        this.getUserList(res => {
            if (res) {
                this.getListOfResearcherProfile();
            }
        });

        //console.log('userDetails', this.userDetails);
    }

    getListOfResearcherProfile() {

        this.spinner=true

        this._researchProfileMultiFormService
            .getListOfResearcherProfile(this.page, this.pageSize)
            .subscribe(
                (res) => {
                    this.dataList = [];
                    res.response.content.forEach((res) => {
                        if (this.userDetails.userType !== 'Rms_DO') {
                            if (+this.userDetails.id === +res.userId) {
                                this.dataList.push({
                                    id: res.id,
                                    uuid: res.uuid,
                                    //name: res.userId,
                                    name: this.getUserNameByUserId(res.userId),
                                    regNo: res.regNumber,
                                    mobileNo: res.mobileNo,
                                    training_of_research: res.researchTraining,
                                    isInstitutional: res.isInstitutional
                                });
                            }
                        } else {

                            this.dataList.push({
                                id: res.id,
                                uuid: res.uuid,
                                // name: res.userId,
                                name: this.getUserNameByUserId(res.userId),
                                regNo: res.regNumber,
                                mobileNo: res.mobileNo,
                                training_of_research: res.researchTraining,
                                isInstitutional: res.isInstitutional
                            });
                        }
                    });
                    if (
                        this.userDetails.userType == 'Rms_Researcher' &&
                        this.dataList.length == 1
                    ) {
                        this.showProfileOnlyResearcher(this.dataList[0]);
                    }
                    this.dataSource = new MatTableDataSource(this.dataList);
                    this.totalElements = res ? res.response.totalElements : 0;
                    this.spinner=false
                },
                (err) => {
                this.spinner=false
                    console.log('Error');
                }
            );
       // this.spinner=false
    }

    getUserNameByUserId(id): string {
        let find = this.userList.find(u => u.id === id);
        return find ? find.name : '';
    }

    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getListOfResearcherProfile();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    editRow(element) {
    }

    deleteProfile(uuId: string) {
        this._researchProfileMultiFormService.deleteProfile(uuId).subscribe(
            (res) => {
                if (res) {
                    this.toastr.success(res.message, '', this.config);
                    this.getListOfResearcherProfile();
                } else {
                    this.toastr.warning(res.message, '', this.config);
                }
            },
            (err) => {
                this.toastr.error(
                    'Http Error Occord !.',
                    'Error!',
                    this.config
                );
            }
        );
    }

    openDialog(uuid: any) {
    }

    addResearcherProfile(uuid: string) {
        this._route.navigate(['researcher-proposal-informationn/add/' + uuid]);
    }

    showProfile(uuid: string, isInstitutional: boolean) {
        this._route.navigate([
            'researcher-profile-information/' + uuid + '/' + isInstitutional + '/view',
        ]);
    }

    showProfileOnlyResearcher(data: any) {
        this._route.navigate([
            'researcher-profile-information/' + data.uuid + '/' + data.id + '/' + data.isInstitutional + '/view',
        ]);
    }

    showResearcherProposal(uuid: string) {
        this._route.navigate(['researcher-proposal-details/view/' + uuid]);
    }

    editProfile(data: any) {
        this._route.navigate([
            'researcher-profile-information/' + data.uuid + '/edit/' + data.id,
        ]);
    }

    private openProfileDeleteDialog(uuid: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.MESSAGE};
        const dialogRef = this._dialog.open(
            SubmitConfirmationDialogComponent,
            dialogConfig
        );

        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            if (res) {
                this.deleteProfile(uuid);
            }
            dialogRef.close(true);
        });
    }

    goToResearcherProposalList(element) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '70%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {...element};
        const dialogRef = this._dialog.open(
            ResearcherProposalListModalComponent,
            dialogConfig
        );
        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            if (res) {
                dialogRef.close(true);
            }
        });
    }

    getUserList(callback) {
        this.userListService.getAllUser().subscribe((res) => {
            this.userList = res ? res : [];
            callback(true)
        }, error => {
            callback(false)
        });
        callback(false)
    }
}
