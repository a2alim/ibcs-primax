import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DateAdapter } from "@angular/material/core";
import { MatInput } from "@angular/material/input";
import { ActivatedRoute } from "@angular/router";
import {
    downloadIcon,
    nextIcon,
    previousIcon,
    printIcon,
    saveIcon,
    updateSuccess
} from 'app/main/modules/rpm/constants/button.constants';
import { AgreementWithResearcherModel } from 'app/main/modules/rpm/models/AgreementWithResearcherModel';
import {
    AgreementWithResearcherServiceService
} from 'app/main/modules/rpm/services/agreement-with-researcher-service.service';
import { ToastrService } from 'ngx-toastr';
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { FiscalYearServiceService } from "../../../../../settings/services/fiscal-year-service.service";
import { LatterModel } from "../../../../models/LatterModel";
import { ResearcherProposalService } from "../../../../services/researcher-proposal.service";
//import { locale as lngBangla, locale as lngEnglish } from "../../i18n/en";
import {locale as lngEnglish} from "../../i18n/en";
import {locale as lngBangla} from "../../i18n/bn";
@Component({
    selector: 'app-agreement-with-researcher-tab',
    templateUrl: './agreement-with-researcher-tab.component.html',
    styleUrls: ['./agreement-with-researcher-tab.component.scss']
})
export class AgreementWithResearcherTabComponent implements OnInit {
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @Output() numberOfInstallment = new EventEmitter<number>();
    @Output() agreementDate = new EventEmitter<any>();
    @Output() rmsProposalId = new EventEmitter<any>();
    
    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    nextIcon = nextIcon;
    saveIcon = saveIcon;
    updateSuccess = updateSuccess;
    /*----/Button---*/
    fiscalYearList: any[] = [];
    researchTitleNames: any[] = [];
    userList: any[] = [];
    userRmsList: any[] = [];
    researcherList:any[] = [];
    latter: LatterModel = new LatterModel();
    spinner: boolean = false;
    @ViewChild('datepicker22', {
        read: MatInput
    }) datepicker2: MatInput;
    agreementWithResearcherModel: AgreementWithResearcherModel = new AgreementWithResearcherModel();
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    agreementId: any;
    isEditable: boolean = false;
    letterId: string;
    fiscalYearId: number;
    formGroup: any;
    year: any;
    researcherProposalList: any[] = new Array();

    stFiscalYearId : number;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private fiscalyearservice: FiscalYearServiceService,
        private toastr: ToastrService,
        private _researcherProposalService: ResearcherProposalService,
        private _activatedRoute: ActivatedRoute,
        private agreementWithResearcher: AgreementWithResearcherServiceService,
        private _agreementWithResearcherServiceService: AgreementWithResearcherServiceService,
        private dateAdapter: DateAdapter<Date>
        ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy
        this.agreementId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.agreementId != null) {
            this.isEditable = true;
        }
    }
    ngOnInit(): void {
        sessionStorage.removeItem("instHeadName");
        sessionStorage.removeItem("recipientUserId");
        sessionStorage.removeItem("proposal_create_by");
        sessionStorage.removeItem("researcherName");
        this.getFiscalYearList()
        this.getResearcherProposalList()

        if (this.isEditable) {
            this.getAllTabData();
        }
        this.getRmsUser();
    }
    getAllTabData() {
        this._agreementWithResearcherServiceService.getAllTabData(this.agreementId).subscribe(
            res => {
                if (res.success) {
                    this.numberOfInstallment.emit(+(res.obj.tabOne.installmentNo));
                    this.agreementDate.emit(res?.obj?.tabOne?.createdOn);
                    this.rmsProposalId.emit(res?.obj?.tabOne?.researcherProposalId?.id);

                    localStorage.setItem("agreement_with_researcher_id", res?.obj?.tabOne?.id);
                    sessionStorage.setItem("proposal_create_by", res?.obj?.tabOne?.researcherProposalId?.createdBy)
                    sessionStorage.setItem("recipientUserId", res?.obj?.tabOne?.recipientUserId);
                    var researchCatId = res?.obj?.tabOne?.researcherProposalId?.stResearchCatTypeId;
                    sessionStorage.setItem("stResearchCatTypeId", researchCatId);                    
                    var head = res?.obj?.tabOne?.researcherProposalId?.researcherProfilePersonalInfoMaster?.instHeadName;
                    if(researchCatId == 1){
                        sessionStorage.setItem("instHeadName", head);
                    }                                        
                    this.agreementWithResearcherModel = res.obj.tabOne                   
                    this.fiscalYearId = res.obj.tabOne.researcherProposalId.stFiscalYearId;

                    this.agreementWithResearcherModel.infoId = res.obj.tabOne.researcherProposalId.id;                    
                    this.researchTitleNames.push({"id": res.obj.tabOne.researcherProposalId.id,
                        "researchTitle": res.obj.tabOne.researcherProposalId.researchTitle
                    });
                    if(res?.obj?.tabOne?.researcherProposalId?.createdBy){
                        this.getAllUser(res?.obj?.tabOne?.researcherProposalId?.createdBy)
                    }
                }
            });
    }
    getFiscalYearList() {
        this.fiscalyearservice.getAllActive().subscribe(
            res => {
                this.fiscalYearList = res.items ? res.items : [];
            }
        );
    }
    save(isNext:boolean) {
        if (!this.isEditable) {

            if (!this.agreementWithResearcherModel) {
                return;
            }
            if (
                !this.stFiscalYearId ||
                !this.agreementWithResearcherModel.infoId ||
                !this.agreementWithResearcherModel.totalGrantAmount ||
                !this.agreementWithResearcherModel.installmentNo ||
                !this.agreementWithResearcherModel.researchStartDate || 
                !this.agreementWithResearcherModel.researchEndDate
            ) {
                this.toastr.warning('Please enter the required information !.','',this.config);
                return;
            }

            this.agreementWithResearcher.saveTabOneData(this.agreementWithResearcherModel).subscribe(
                res => {
                    if (res.success) {   
                        this.numberOfInstallment.emit(+(this.agreementWithResearcherModel.installmentNo));
                        this.agreementDate.emit(res?.obj?.createdOn);

                        localStorage.removeItem('grand_amount');
                        localStorage.removeItem('userIdForPartyWitness');
                        localStorage.removeItem('agreement_with_researcher_id');                        
                        localStorage.removeItem('agreementDate');                          
                        localStorage.setItem('userIdForPartyWitness', res.obj.researcherProposalId.researcherProfilePersonalInfoMaster.userId);
                        localStorage.setItem('grand_amount', String(this.agreementWithResearcherModel.totalGrantAmount));
                        localStorage.setItem('agreement_with_researcher_id', String(res.obj.id));   
                                                                        
                        this.agreementWithResearcher.agreementResponseData = res;                            
                        this.toastr.success(res.message, "", this.config);
                        if(isNext){
                            this.nextTab()
                        }
                    } else {
                        this.toastr.warning(res.message, "", this.config);
                    }
                },
                err => {
                    this.toastr.error('Http Error Occurred !.', "", this.config);
                }
            );
        } else {
            this.agreementWithResearcher.updateTabOneData(this.agreementWithResearcherModel).subscribe(
                res => {
                    this.numberOfInstallment.emit(+(this.agreementWithResearcherModel.installmentNo));
                    this.agreementDate.emit(this.agreementWithResearcherModel?.createdOn);

                    this.toastr.success(this.updateSuccess, "", this.config);
                    localStorage.removeItem('grand_amount');
                    localStorage.removeItem('userIdForPartyWitness');
                    localStorage.removeItem('agreement_with_researcher_id');                    
                    localStorage.setItem('userIdForPartyWitness', this.agreementWithResearcherModel.researcherProposalId.researcherProfilePersonalInfoMaster.userId);
                    localStorage.setItem('grand_amount', String(this.agreementWithResearcherModel.totalGrantAmount));
                    localStorage.setItem('agreement_with_researcher_id', String(this.agreementWithResearcherModel.id));
                    if (isNext){
                        this.nextTab();
                    }
                },
                err => {
                    this.toastr.error('Http Error Occurred !.', "", this.config);
                }
            );
            console.log('agreementWithResearcherModel:', this.agreementWithResearcherModel)
        }
    }
    findResearcherNamesByFiscalYear(stFiscalYearId: any) {
        if(stFiscalYearId > 0){
            this.stFiscalYearId = stFiscalYearId;
            this.spinner = true;
            this.researchTitleNames = this.researcherProposalList.filter(rp => rp.stFiscalYearId === stFiscalYearId);
            this.spinner = false;
            if (this.researchTitleNames.length == 0) {
                const find = this.fiscalYearList.find(f => f.id === stFiscalYearId);
                this.toastr.warning("Fiscal Year " + find.fiscalYear + " No Proposal Available!", "", this.config);
            }
        }
        
    }
    private getResearcherProposalList() {
        this.spinner = true
        this._researcherProposalService.getAllByFinalSubmit(true).subscribe(value => {
            this.researcherProposalList = value.items;
            // value.items.forEach(item => {
            //     this.researcherProposalList.push(item)
            // })
            this.spinner = false;
        }, error => {
            this.spinner = false;
        })
    }
    getRmsUser() {
        this.agreementWithResearcher.getUserByType('Rms_DO').subscribe(
            res => {
                this.userRmsList = res;
            }
        );
        
    }

    getAllUser(createdBy='') {

        this.agreementWithResearcher.getUserByType('Rms_Researcher').subscribe(
            res => {
                res.forEach(val => {
                    if(val.id == createdBy){
                        sessionStorage.setItem("researcherName", val.name);
                    }
                    this.researcherList.push(val); 
                });
            }
        );

        // this.agreementWithResearcher.getUser().subscribe(
        //     res => {
        //         this.userList = res;
        //         res.forEach(val => {
        //             if(val.userType == 'Rms_Researcher'){
        //                 if(val.id == createdBy){
        //                     sessionStorage.setItem("researcherName", val.name);
        //                 }
        //                 this.researcherList.push(val); 
        //             }
        //             if(val.userType == 'Rms_DO'){
        //                 this.userRmsList.push(val); 
        //             }
        //         });
        //     }
        // );
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
    saveAndNext(isNext:boolean) {
        this.save(isNext)
    }
    ageCalculator() {
        if (this.agreementWithResearcherModel.researchStartDate) {
            
            var months;
            var d1 = new Date(this.agreementWithResearcherModel.researchStartDate);
            var d2 = new Date(this.agreementWithResearcherModel.researchEndDate);
            months = (d2.getFullYear() - d1.getFullYear()) * 12;
            months -= d1.getMonth();
            months += d2.getMonth();
            //return months <= 0 ? 0 : months;
            this.agreementWithResearcherModel.researchDuration = months <= 0 ? 0 : months;


            // const convertAge = new Date(this.agreementWithResearcherModel.researchStartDate);
            // const end = new Date(this.agreementWithResearcherModel.researchEndDate);
            // const timeDiff = Math.abs(end.getTime() - convertAge.getTime());
            // this.agreementWithResearcherModel.researchDuration = String(Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365));

            // let sdt: any = new Date(this.agreementWithResearcherModel.researchStartDate);
            // let endDate: any = new Date(this.agreementWithResearcherModel.researchEndDate);
            // let difdt: any = new Date(endDate - sdt);
            // this.agreementWithResearcherModel.researchDuration = (difdt.toISOString().slice(0, 4) - 1970) + "Year " + (difdt.getMonth()) + "Month " + difdt.getDate() + "Day";
        }
    }
    dateValidity() {
        let researchStartDate = this.agreementWithResearcherModel.researchStartDate;
        let researchEndDate = this.agreementWithResearcherModel.researchEndDate;
        if (researchStartDate > researchEndDate) {
            this.datepicker2.value = '';
            this.agreementWithResearcherModel.researchEndDate = null
            // this.agreementWithResearcherModel.researchStartDate = null
            this.agreementWithResearcherModel.researchDuration = null
            this.toastr.warning('Research end date must be grater than of research start date  !', "", this.config);
        } else {
            this.ageCalculator();
        }
    }
}
