import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { SectorTypeService } from 'app/main/modules/settings/services/sector-type.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { ToastrService } from "ngx-toastr";
import { FuseTranslationLoaderService } from "../../../../../../../core/services/translation-loader.service";
import { AuthService } from "../../../../../../auth/services/auth.service";
import { FiscalYearServiceService } from "../../../../../../settings/services/fiscal-year-service.service";
import { UserListServiceService } from "../../../../../../settings/services/user-list-service.service";
import { SeminarTimeScheduleFormModel } from "../../../../../models/SeminarTimeScheduleFormModel";
import { ResearcherProposalService } from "../../../../../services/researcher-proposal.service";
import { SeminarService } from "../../../../../services/seminar.service";
import { locale as lngBangla } from "../../../i18n/bn";
import { locale as lngEnglish } from "../../../i18n/en";
import { RESEARCH_CATEGORIES } from 'app/main/core/constants/researchCategories.constants';

@Component({
    selector: 'app-seminar-time-schedule-tab',
    templateUrl: './seminar-time-schedule-tab.component.html',
    styleUrls: ['./seminar-time-schedule-tab.component.scss']
})
export class SeminarTimeScheduleTabComponent implements OnInit {



    @ViewChild('myForm') mytemplateForm: FormBuilder;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    seminarTimeScheduleFormModel: SeminarTimeScheduleFormModel = new SeminarTimeScheduleFormModel();

    fileToUpload: { id: number, file: File }[] = [];

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    isUpdatedAction: boolean;
    isVerifiedNid: boolean = false;
    isVerifiedTin: boolean = false;
    profileImageName: string = null;
    signImageName: string = null;

    fiscalYearList: any[] = [];
    userList: any[] = [];
    researcherProposalList: any[] = new Array();
    displayedColumns: string[] = ['position', 'position_in_seminar', 'start_date', 'action'];
    dataSource: any;
    timeScheduleList: any[] = new Array();
    timeScheduleLeadList: any[] = new Array();
    timeScheduleResearcherList: any[] = new Array();
    timeScheduleOthersList: any[] = new Array();

    isResearcher: boolean = false;
    isLead: boolean = false;
    isOthers: boolean = false;
    id: any;
    uuid: any;


    spinner: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;
    spinner4: boolean = false;
    spinner5: boolean = false;
    spinner6: boolean = false;

    seminarId: number;

    sectorList:any[] = [];
    pushSectorList:any[] = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _researcherProposalService: ResearcherProposalService,
        private userListService: UserListServiceService,
        private _fiscalYearService: FiscalYearServiceService,
        private _seminarService: SeminarService,
        private _sectorTypeService : SectorTypeService,
        private _dialog: MatDialog,) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.id = this._activatedRoute.snapshot.paramMap.get('id');
        this.uuid = this._activatedRoute.snapshot.paramMap.get('uuid');

        this._sectorTypeService.getAllActiveList().subscribe(res => {
                this.sectorList = res.items ? res.items : [];
                if (this.uuid != null) {
                    this.getSeminarTimeScheduleListBySeminarId(this.id);
                }
            }
        );        

        this.getFiscalYearList();
        this.getRmsDoUserList();
        this.getProposalList();
    }

    ngOnInit(): void {
    }

    // private getDataByUuid() {
    //     this._seminarService.getSeminarById(this.id).subscribe(
    //         res => {
    //             console.log('=========================================')
    //             console.log(res.obj.createSeminarTimeScheduleOptional);
    //             console.log('=========================================')
    //             res.obj.createSeminarTimeScheduleOptional.forEach(res => {

    //                 this.timeScheduleList.push({
    //                     seminarId: res.m2CreateSeminarId?.id,
    //                     proposalId: res.m1ResearcherProposalId?.id,
    //                     startTime: res.startTime,
    //                     positionInSeminar: res.positionInSeminar,
    //                     scheduleName: res.scheduleName,
    //                     concernedPersonUserId: res.concernedPersonUserId
    //                 });

    //                 this.dataSource = new MatTableDataSource(this.timeScheduleList);
    //             });
    //             console.log("this.timeScheduleList => ", this.timeScheduleList);
    //             this.dataSource = new MatTableDataSource([
    //                 {
    //                     seminarId: res.m2CreateSeminarId.id,
    //                     proposalId: res.m1ResearcherProposalId.id,
    //                     startTime: res.startTime,
    //                     positionInSeminar: res.positionInSeminar,
    //                     scheduleName: res.scheduleName,
    //                     concernedPersonUserId: res.concernedPersonUserId
    //                 }
    //             ]);
    //         },
    //         error => {
    //             this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
    //         }
    //     );
    // }


    getDataByUuid() {
        this.spinner4 = true;
        this._seminarService.getSeminarById(this.id).subscribe(
            res => {
                if (res.obj.createSeminarTimeScheduleOptional) {
                    res.obj.createSeminarTimeScheduleOptional.forEach(res => {
                        this.timeScheduleList.push({
                            seminarId: res.m2CreateSeminarId?.id,
                            proposalId: res.m1ResearcherProposalId?.id,
                            startTime: res.startTime,
                            positionInSeminar: res.positionInSeminar,
                            scheduleName: res.scheduleName,
                            concernedPersonUserId: res.concernedPersonUserId
                        });
                    });
                }
                this.spinner4 = false;
            },
            error => {
                this.spinner4 = false;
                this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
            }
        );
    }


    getSeminarTimeScheduleListBySeminarId(seminarId: number) {

        this.spinner4 = true;
        this._seminarService.getSeminarTimeScheduleListBySeminarId(this.id).subscribe(
            res => {

                let root = this;
                this.getAllInformation( res, proposalList => {
                    if(proposalList.length > 0) 
                    {
                        proposalList.forEach( function(v,i){
                            root.timeScheduleResearcherList[i] = v;
                            root.timeScheduleResearcherList[i]['sectorName'] = root.sectorName(v?.m1ResearcherProposalId?.stSectorTypeId);                          
                        })
                    }
                    
                })
            },
            error => {
                this.spinner4 = false;
                this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
            }
        );
    }

    getAllInformation(res, callback){
        this.timeScheduleList = res.items ? res.items : [];
        this.timeScheduleList.sort((a, b) => 0 - (a.id > b.id ? -1 : 1));
        this.timeScheduleLeadList = this.timeScheduleList.filter(f => f.positionInSeminar == 'Lead');
        let proposalList = this.timeScheduleList.filter(f => f.positionInSeminar == 'Researcher');
        this.timeScheduleOthersList = this.timeScheduleList.filter(f => f.positionInSeminar == 'Others');

        this.spinner4 = false;        
        callback(proposalList);
    }

    sectorName(sectorId)
    {
        const result = this.sectorList.find((v) => v.id === sectorId);
        return result;
    }

    getProposalList() {

        this.spinner3 = true;
        this._researcherProposalService.getAll().subscribe(
            value => {
                this.researcherProposalList = value.items ? value.items : [];
                this.spinner3 = false;
            },
            error => {
                this.spinner3 = false;
            });
    }

    addNewRowInTable() {
        this.timeScheduleList.push({
            seminarId: +(localStorage.getItem('seminarId')),
            proposalId: this.seminarTimeScheduleFormModel.proposalId,
            startTime: this.seminarTimeScheduleFormModel.startTime,
            positionInSeminar: this.seminarTimeScheduleFormModel.positionInSeminar,
            scheduleName: this.seminarTimeScheduleFormModel.scheduleName,
            concernedPersonUserId: this.seminarTimeScheduleFormModel.concernedPersonUserId
        })
        this.dataSource = new MatTableDataSource(this.timeScheduleList);
    }

    getFiscalYearList() {
        this.spinner = true;
        this._fiscalYearService.getAllActive().subscribe(
            res => {
                this.fiscalYearList = res.items ? res.items : [];
                this.spinner = false;
            },
            error => {
                this.spinner = false;
            }
        );
    }

    // saveAndUpdate() {
    //     if (!this.isUpdatedAction) {
    //         this._seminarService.saveTimeScheduleSeminar(this.timeScheduleList).subscribe(
    //             res => {
    //                 if (res.success) {
    //                     this._toastrService.success(res.message, "Success!", this.config);
    //                 }
    //             },
    //             error => {
    //                 this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
    //             }
    //         )
    //     } else {
    //         this._seminarService.updateTimeScheduleSeminar(this.timeScheduleList).subscribe(
    //             res => {
    //                 if (res.success) {
    //                     this._toastrService.success(res.message, "Success!", this.config);
    //                 }
    //             },
    //             error => {
    //                 this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
    //             }
    //         )
    //     }
    // }

    onSaveOrUpdate() {

        if (this.isLead && (!this.seminarTimeScheduleFormModel.positionInSeminar || !this.seminarTimeScheduleFormModel.name || !this.seminarTimeScheduleFormModel.startTime || !this.seminarTimeScheduleFormModel.scheduleName || !this.seminarTimeScheduleFormModel.emailAddress)) {
            return;
        }

        if (this.isResearcher && (!this.seminarTimeScheduleFormModel.positionInSeminar || !this.seminarTimeScheduleFormModel.startTime || !this.seminarTimeScheduleFormModel.proposalId || !this.seminarTimeScheduleFormModel.reviewTime)) {
            return;
        }

        if (this.isOthers && (!this.seminarTimeScheduleFormModel.positionInSeminar || !this.seminarTimeScheduleFormModel.startTime || !this.seminarTimeScheduleFormModel.scheduleName)) {
            return;
        }

        if (this.seminarTimeScheduleFormModel.id) {
            this.onUpdate();
        } else {
            this.onSave();
        }
    }

    onSave() {

        if (localStorage.getItem("seminarId")) {
            this.seminarTimeScheduleFormModel.seminarId = +(localStorage.getItem("seminarId"));
        } else {
            this.seminarTimeScheduleFormModel.seminarId = this.id ? this.id : null;
        }

        if (!this.seminarTimeScheduleFormModel.seminarId) {
            this._toastrService.error('Seminar not found!', "Error!", this.config);
            return;
        }

        this.spinner5 = true;
        this._seminarService.saveTimeSchedule(this.seminarTimeScheduleFormModel).subscribe(
            res => {
                if (res.success) {
                    this._toastrService.success(res.message, "Success!", this.config);
                    this.seminarTimeScheduleFormModel = new SeminarTimeScheduleFormModel();
                    this.getSeminarTimeScheduleListBySeminarId(res.obj.m2CreateSeminarId.id);
                } else {
                    this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
                }
                this.spinner5 = false;
            },
            error => {
                this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
                this.spinner5 = false;
            }
        );
    }

    onUpdate() {
        this.spinner5 = true;
        this._seminarService.updateTimeSchedule(this.seminarTimeScheduleFormModel).subscribe(
            res => {
                if (res.success) {
                    this._toastrService.success(res.message, "Success!", this.config);
                    this.seminarTimeScheduleFormModel = new SeminarTimeScheduleFormModel();
                    this.getSeminarTimeScheduleListBySeminarId(res.obj.m2CreateSeminarId.id);
                } else {
                    this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
                }
                this.spinner5 = false;
            },
            error => {
                this._toastrService.error('Smoothing want to wrong!', "Error!", this.config);
                this.spinner5 = false;
            }
        );
    }

    saveAndNext() {
        // this.saveAndUpdate();
        this.nextTab();
    }

    editProfile(element) {

    }

    deleteDialog(index: number) {
        this.timeScheduleList.splice(index)
        this.dataSource = new MatTableDataSource(this.timeScheduleList);
    }

    actionByChange(value: string) {
        if (value === 'Lead') {
            this.isResearcher = false;
            this.isLead = true;
            this.isOthers = false;
        } else if (value === 'Researcher') {
            this.isResearcher = true;
            this.isLead = false;
            this.isOthers = false;
        } else if (value === 'Others') {
            this.isResearcher = false;
            this.isLead = false;
            this.isOthers = true;
        }
    }

    onEdit(data: any) {

        this.actionByChange(data.positionInSeminar);
        this.seminarTimeScheduleFormModel.seminarId = data.m2CreateSeminarId.id;
        this.seminarTimeScheduleFormModel.id = data.id;
        this.seminarTimeScheduleFormModel.uuid = data.uuid;
        this.seminarTimeScheduleFormModel.proposalId = data.m1ResearcherProposalId ? data.m1ResearcherProposalId.id : null;
        this.seminarTimeScheduleFormModel.positionInSeminar = data.positionInSeminar;
        this.seminarTimeScheduleFormModel.scheduleName = data.scheduleName;
        this.seminarTimeScheduleFormModel.startTime = data.startTime;
        this.seminarTimeScheduleFormModel.concernedPersonUserId = data.concernedPersonUserId;
        this.seminarTimeScheduleFormModel.reviewTime = data.reviewTime;
        this.seminarTimeScheduleFormModel.name = data.name;
        this.seminarTimeScheduleFormModel.mobile = data.mobile;
        this.seminarTimeScheduleFormModel.emailAddress = data.emailAddress;
        this.seminarTimeScheduleFormModel.designation = data.designation;
    }

    getRmsDoUserList() {
        this.spinner2 = true;
        this.userListService.getUserByType('Rms_DO').subscribe(
            res => {
                this.userList = res ? res : [];
                this.spinner2 = false;
            },
            error => {
                this.spinner2 = false;
            }
        );
    }

    /* For Tab  */
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();


    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }


    private openDeleteDialog(uuid: string, seminarId: number) {
        this.seminarId = seminarId;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
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


    deleteProfile(uuId: string) {
        this._seminarService.deleteTimeScheduleSeminar(uuId).subscribe(
            (res) => {
                if (res) {
                    this._toastrService.success(res.message, 'Success!', this.config);
                    this.getSeminarTimeScheduleListBySeminarId(this.seminarId);
                } else {
                    this._toastrService.warning(res.message, 'Failed!', this.config);
                }
            },
            (err) => {
                this._toastrService.error(
                    'Http Error Occord !.',
                    'Error!',
                    this.config
                );
            }
        );
    }


}
