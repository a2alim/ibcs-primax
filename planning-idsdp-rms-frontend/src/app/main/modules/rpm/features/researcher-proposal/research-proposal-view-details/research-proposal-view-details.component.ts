import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from "@angular/router";
import { ERROR, OK } from 'app/main/core/constants/message';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { environment, reportBackend } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { UnsubscribeAdapterComponent } from "../../../../../core/helper/unsubscribeAdapter";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { downloadIcon, noteIcon, previousIcon, printIcon, viewIcon } from '../../../constants/button.constants';
import { sdgsGoalsList } from '../../../contants/sdgs-goals-list.constant';
import { ResearcherProposal } from "../../../models/ResearcherProposal";
import { ResearcherProposalActionPlan } from "../../../models/ResearcherProposalActionPlan";
import { ResearcherProposalBudgetDetails } from "../../../models/ResearcherProposalBudgetDetails";
import { ResearcherProposalInformation } from "../../../models/ResearcherProposalInformation";
import { ResearcherProposalInstitutionInformation } from "../../../models/ResearcherProposalInstitutionInformation";
import { ResearcherProposalRscWorkingInOrganization } from "../../../models/ResearcherProposalRscWorkingInOrganization";
import { ResearcherProposalUploadDoc } from "../../../models/ResearcherProposalUploadDoc";
import { ResearcherSupervisorInformation } from "../../../models/ResearcherSupervisorInformation";
import { JasperServiceService } from "../../../services/jasper-service.service";
import { ResearcherProposalService } from "../../../services/researcher-proposal.service";
import { locale as lngBangla } from "./i18n/bn";
import { locale as lngEnglish } from "./i18n/en";
import * as bl2Js from 'bl2-js-report';
import {Location} from "@angular/common";
@Component({
    selector: 'app-research-proposal-view-details',
    templateUrl: './research-proposal-view-details.component.html',
    styleUrls: ['./research-proposal-view-details.component.scss']
})
export class ResearchProposalViewDetailsComponent extends UnsubscribeAdapterComponent implements OnInit {
    uuid: string;
    spinner: boolean;
    spinner2: boolean;
    spinner5: boolean;
    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    viewIcon = viewIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    /*----/Button---*/
    userList: any[] = [];
    sdgsGoalsList = sdgsGoalsList;
    documentTypeList: any[] = [];
    config: { timeOut: 90000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    userDetails: { id: null, userId: null, name: null, userType: null, emailId: null, designation: null, mobileNumber: null, isActive: false, isInstitutional: false };
    isFinalSubmit: Boolean = true;
    profileUuid: any;
    isIsntitunal: boolean = false;
    data: {
        researcherProposal: ResearcherProposal,
        researcherProposalInfo: ResearcherProposalInformation,
        researcherProposalInstituteInfo: ResearcherProposalInstitutionInformation,
        researcherProposalRscWorkingInOrg: ResearcherProposalRscWorkingInOrganization[],
        researcherSupervisorInfo: ResearcherSupervisorInformation,
        researcherProposalUploadDoc: ResearcherProposalUploadDoc[],
        researcherProposalActionPlan: ResearcherProposalActionPlan[],
        researcherProposalBudgetDetails: ResearcherProposalBudgetDetails[],
    };
    langVal: string;
    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private researcherProposalService: ResearcherProposalService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userListService: UserListServiceService,
        private api: ApiService,
        private jasperService: JasperServiceService,
        private matSnackBar: SnackbarHelper,
        private toastr: ToastrService,
        private storageService: StorageService,
        private dialog: MatDialog,
        private dataCom: DataComService,
                private _location: Location
    ) {
        super();
        this.langVal = localStorage.getItem('currentLang');
        this.dataCom.getPassedItemData.subscribe((res) => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
                console.log('this.langVal  ', this.langVal);
            }
        });
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.userDetails = this.storageService.getUserData();
        this.activatedRoute.params.subscribe(params => {
            this.uuid = params['uuId'];
        });
        this.getAllData();
        // this.getUserList();
        this.getCommonTypeListData();
    }

    private getAllData() {
        this.spinner = true;
        this.subscribe$.add(
            this.researcherProposalService.getResearcherProposalDetailsByUuid(this.uuid).subscribe(
                res => {
                    if (res.success) {
                        this.data = res.obj;
                        if(this.data.researcherProposal.stSdgsGoalsId){
                            this.data.researcherProposal.sdgsGoalsStr =  this.sdgsGoals(this.data.researcherProposal.stSdgsGoalsId);
                        }
                        if (this.data.researcherProposalUploadDoc) {
                            this.data.researcherProposalUploadDoc.forEach(f => {
                                f.documentTypeName = this.showDocumentTypeName(f.stDocumentTypeId);
                            });
                        }
                        this.profileUuid = this.data.researcherProposal.researcherProfilePersonalInfoDto.uuid;
                        this.isIsntitunal = this.data.researcherProposal.researcherProfilePersonalInfoDto.isInstitutional
                        this.isFinalSubmit = (this.data.researcherProposal.isFinalSubmit) ? true : false;
                    }
                    this.spinner = false;
                }
            )
        )
    }
    back() {
        // this.router.navigate(['/researcher/list']);
        this._location.back();
    }
    edit() {
        this.router.navigate(['/researcher-proposal-informationn/edit/']);
    }
    // printDiv(divName) {
    //     var printContents = document.getElementById(divName).innerHTML;
    //     var originalContents = document.body.innerHTML;
    //     document.body.innerHTML = printContents;
    //     window.print();
    //     window.location.reload();
    //     document.body.innerHTML = originalContents;
    // }
    download() {
        let lang = localStorage.getItem("currentLang");
        this.genPdf(lang);
    }
    genPdf(lang) {
        this.spinner2 = true;
        this.jasperService.proposalPdf(this.uuid, lang).subscribe((response) => {
            this.spinner2 = false;
            let file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, error => {
            this.spinner2 = false;
        })
    }
    downloadFile(data: any) {
        window.open(environment.ibcs.minioEndPointHost + data.fileDownloadUrl);
    }
    downloadPdf($fileName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/research-proposal-view';
        this.data['lng'] = localStorage.getItem("currentLang");
        this.data['data'] = JSON.stringify(this.data);
        this.data['userDetails']=JSON.stringify(this.userDetails);
        this.data['downloadUrl'] = environment.ibcs.minioEndPointHost;
        console.log('this.data = ', this.data);
        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }
    getUserList() {
        this.userListService.getAllUser().subscribe(
            res => {
                this.userList = res ? res : [];
            }
        );
    }
    showUserName(userId: number) {
        if (!userId) {
            return '';
        }
        return this.userList.find(f => f.userId == userId).name ? this.userList.find(f => f.userId == userId).name : '';
    }
    sdgsGoals(sdgsGoalsId: string) {
        let sdgsGoalsStr = ''
        if (!sdgsGoalsId) {
            return sdgsGoalsStr;
        }
        let sdgsGoalIdList = JSON.parse(sdgsGoalsId);
        if (!sdgsGoalIdList) {
            return sdgsGoalsStr;
        }
        if (typeof sdgsGoalIdList == 'object') {
            sdgsGoalIdList.forEach(e => {
                let g = this.sdgsGoalsList.find(f => f.id == e);
                sdgsGoalsStr += g.name + ' , ';
            });
        }
        return sdgsGoalsStr;
    }
    getCommonTypeListData() {
        const baseUrl = environment.ibcs.rmsConfigurationBackend + 'api/common-type/';
        const getUrl = baseUrl + 'get-list';
        this.api.get(getUrl).subscribe(res => {
            if (res.success && res.items) {
                this.documentTypeList = res.items;
                this.documentTypeList = this.documentTypeList.filter(f => f.typeNo == 3) ? this.documentTypeList.filter(f => f.typeNo == 3) : [];
            }
        });
    }
    showDocumentTypeName(id: number) {
        if (!id) {
            return '';
        }
        return this.documentTypeList.find(f => f.id == id) ? this.documentTypeList.find(f => f.id == id).typeName : '';
    }
    print() {
    }

    printDiv(divName) {
        //window.location.href = window.location.href;
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        //return false;
        window.location.reload();
        document.body.innerHTML = originalContents;
    }
    goToProfile() {
        this.router.navigate([
            'researcher-profile-information/' + this.profileUuid + '/' + this.isIsntitunal + '/view',
        ]);
    }
    finalSubmit(finalSubmit: boolean = false) {
        if (!this.onCheckFromSubmit()) {
            return;
        }
        const sendData = {
            id: this.data.researcherProposal.id,
            isFinalSubmit: true
        }
        this.spinner5 = true;
        this.researcherProposalService.updateFinalSubmitStatus(sendData).subscribe(
            response => {
                if (response.success) {
                    this.isFinalSubmit = (response.obj.isFinalSubmit) ? true : false;
                    if (finalSubmit == false) {
                        this.matSnackBar.openSuccessSnackBarWithMessage(response.message, OK);
                    }
                    else {
                        this.matSnackBar.openSuccessSnackBarWithMessage('Proposal final submitted successfully!', OK);
                    }
                } else {
                    this.matSnackBar.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.spinner5 = false;
            },
            error => {
                this.spinner5 = false;
            }
        );
    }
    onCheckFromSubmit(): Boolean {
        let submitStatus = true;
        if (!this.data.researcherProposalInfo) {
            this.toastr.error('Please submit information of research', "", this.config);
            submitStatus = false;
        }
        // if (!this.data.researcherProposalRscWorkingInOrg) {
        //     this.toastr.error('Please submit researcher working in organization!.', "", this.config);
        //     submitStatus = false;
        // }
        if (!this.data.researcherProposalUploadDoc) {
            this.toastr.error('Please submit documents!.', "", this.config);
            submitStatus = false;
        }
        // if (!this.data.researcherSupervisorInfo) {
        //     this.toastr.error('Please submit researcher supervisor info!.', "", this.config);
        //     submitStatus = false;
        // }
        if (!this.data.researcherProposalActionPlan) {
            this.toastr.error('Please submit action plan!.', "", this.config);
            submitStatus = false;
        }
        if (!this.data.researcherProposalBudgetDetails) {
            this.toastr.error('Please submit budget details!.', "", this.config);
            submitStatus = false;
        }
        return submitStatus;
    }
    private openFinalSubmitDialog(finalSubmit: boolean) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: `Do you want to submit the final proposal?` };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(
            res => {
                if (res) {
                    this.finalSubmit(finalSubmit);
                }
                dialogRef.close(true);
            }
        );
    }
    getTotal() {
        let totalAmt = 0;
        if (this.data && this.data.researcherProposalBudgetDetails && this.data.researcherProposalBudgetDetails.length > 0) {
            totalAmt = this.data.researcherProposalBudgetDetails.map(m => m.totalAmount).reduce((a, b) => a + b, 0);
        }
        return totalAmt;
        return totalAmt + '.00';
    }
}
