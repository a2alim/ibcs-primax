import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {
    downloadIcon,
    nextIcon,
    previousIcon,
    printIcon,
    saveIcon,
    updateSuccess
} from 'app/main/modules/rpm/constants/button.constants';
import { ToastrService } from "ngx-toastr";
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { FiscalYearServiceService } from "../../../../../settings/services/fiscal-year-service.service";
import { UserListServiceService } from "../../../../../settings/services/user-list-service.service";
import { AgreementPartyFormModel } from "../../../../models/AgreementPartyFormModel";
import { AgreementWithResearcherServiceService } from "../../../../services/agreement-with-researcher-service.service";
import { LatterService } from "../../../../services/latter.service";
import { ResearcherProposalService } from "../../../../services/researcher-proposal.service";
import { locale as lngBangla, locale as lngEnglish } from "../../i18n/en";
@Component({
    selector: 'app-agreement-party',
    templateUrl: './agreement-party.component.html',
    styleUrls: ['./agreement-party.component.scss']
})
export class AgreementPartyComponent implements OnInit {
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    nextIcon = nextIcon;
    saveIcon = saveIcon;
    updateSuccess = updateSuccess;
    agreementPartyFormModel: AgreementPartyFormModel = new AgreementPartyFormModel();
    file: any;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    agreementId: any;
    isEditable: boolean = false;
    secondPartyUserName: string;
    signatureImageName: string = null;
    uIdForUpdate: any;
    researcherProposalList: any[] = new Array();
    userList: any;
    userList2: any;
    spinner: boolean = false;
    
    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private toastr: ToastrService,
        private userListService: UserListServiceService,
        private agreementWithResearcher: AgreementWithResearcherServiceService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.agreementId = sessionStorage.getItem("agreementId"); //this._activatedRoute.snapshot.paramMap.get('id');
        if (this.agreementId != null) {
            this.isEditable = true;
        }
    }
    ngOnInit(): void {
        this.secondPartyUserName = "";
        if(Number(sessionStorage.getItem("stResearchCatTypeId")) == 1)
        {
            //console.log('sessionStorage.getItem("instHeadName") =', sessionStorage.getItem("instHeadName"));
            this.secondPartyUserName = sessionStorage.getItem("instHeadName");
        }
        else{
            //this.set2NdWitness();
            //console.log('sessionStorage.getItem("researcherName") =', sessionStorage.getItem("researcherName"));
            this.secondPartyUserName = sessionStorage.getItem("researcherName");
        } 
        this.getUserList();
        this.getRmsUser();
        this.getAllTabData();
    }
    getAllTabData() {
        this.agreementWithResearcher.agreementAllDataResponse.asObservable().subscribe(
            response => {
                if (response != null) {                   
                    var fourTab = response.obj.tabFour;
                    this.agreementPartyFormModel = fourTab;
                    this.signatureImageName = fourTab.fileNameSignature
                    this.uIdForUpdate = response.obj.tabOne.researcherProposalId.researcherProfilePersonalInfoMaster.userId;                    
                    this.agreementPartyFormModel.secondPartyUserId = Number(sessionStorage.getItem("proposal_create_by"));                    
                }
            })
    }
    getInfo(data, callback){
    }
    set2NdWitness() {
        let wId = null;
        if (!this.isEditable) {
            wId = +localStorage.getItem('userIdForPartyWitness')
        } else {
            wId = this.uIdForUpdate;
        }
        console.log('wId == ', wId)
        let item = this.userList.find(f => f.id === wId);
        this.secondPartyUserName = item?.name;
    }
    handleFileInput(files: FileList, number: number) {
        this.file = files.item(0);
    }
    /*
   * Bottom Default Tab Options
   * */
    nextTab() {
        this.nextStep.emit(true);
    }
    previousTab(): void {
        this.backPrevious.emit(true);
    }
    save() {
        if (!this.checkRequirdField()) {
            return;
        }
        if (!this.agreementPartyFormModel.id) {
            this.spinner = true
            this.agreementPartyFormModel.agreementId = localStorage.getItem('agreement_with_researcher_id')
            this.agreementWithResearcher.saveTabFourData(this.agreementPartyFormModel, this.file).subscribe(res => {
                this.spinner = false
                if (res.success) {
                    this.toastr.success(res.message, "", this.config);
                } else {
                    this.toastr.error(res.message, "", this.config);
                }
            })
        } else {
            this.spinner = true
            this.agreementPartyFormModel.agreementId = localStorage.getItem('agreement_with_researcher_id')
            this.agreementWithResearcher.updateTabFourData(this.agreementPartyFormModel.agreementWithResearcherId.id, this.agreementPartyFormModel, this.file).subscribe(res => {
                this.spinner = false
                if (res.success) {
                    this.toastr.success(this.updateSuccess, "", this.config);
                } else {
                    this.toastr.error(res.message, "", this.config);
                }
            })
        }
    }
    getUserList() {
        this.userListService.getAllUser().subscribe(
            res => {
                this.userList = res ? res : [];
                if (this.isEditable) {
                    this.getAllTabData();
                }
            }
        );
    }
    getRmsUser() {
        this.agreementWithResearcher.getUserByType('Rms_DO').subscribe(
            res => {
                this.userList2 = res ? res : [];
            }
        );
    }
    saveAndNext() {
        if (!this.checkRequirdField()) {
            return;
        }
        this.save();
        this.nextTab();
    }
    checkRequirdField(): Boolean {
        let isValied = true;
        if (!this.agreementPartyFormModel.firstPartyUserId || !this.agreementPartyFormModel.secondPartyWitnessName) {
            return isValied = false;
        }
        return isValied;
    }
}
