import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FuseTranslationLoaderService } from "../../../../../../../core/services/translation-loader.service";
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { UnsubscribeAdapterComponent } from "../../../../../../../core/helper/unsubscribeAdapter";
import { ResearcherProposalActionPlan } from "../../../../../models/ResearcherProposalActionPlan";
import { ResearcherProposal } from "../../../../../models/ResearcherProposal";
import { BehaviorSubject } from "rxjs";
import { SnackbarHelper } from "../../../../../../../core/helper/snackbar.helper";
import { ResearcherProposalActionPlanService } from "../../../../../services/researcher-proposal-action-plan.service";
import { addNewIcon, nextIcon, previousIcon, refreshIcon, saveIcon } from 'app/main/modules/rpm/constants/button.constants';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SubmitConfirmationDialogComponent } from 'app/main/shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'app/main/core/services/api/api.service';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';

@Component({
    selector: 'app-researcher-proposal-action-plan',
    templateUrl: './researcher-proposal-action-plan.component.html',
    styleUrls: ['./researcher-proposal-action-plan.component.scss']
})
export class ResearcherProposalActionPlanComponent extends UnsubscribeAdapterComponent implements OnInit, OnChanges {

    @Input() existingProposalInfo: ResearcherProposal;
    @Input() brodCastChange: BehaviorSubject<any>;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    @Input() getFiscalYearId = new EventEmitter<any>();
    @Input() rCategoryId = new EventEmitter<any>();

    existingProposalInfoId: number = 0;
    spinner = true;
    actionPlans: ResearcherProposalActionPlan[] = [];
    canSave: boolean;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    formSubmit: boolean;
//    actionPlanList= [];
    actionPlanList: ResearcherProposalActionPlan[] = [];
    actionPlanListStore = [];
    storeActionPlan = [];
    langVal: string;

    constructor(
        private dateAdapter: DateAdapter<Date>,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private service: ResearcherProposalActionPlanService,
        private snackbarHelper: SnackbarHelper,
        private matDialog: MatDialog,
        private _toastrService : ToastrService,
        private api: ApiService,
        private _route: Router,
        private dataComService: DataComService,
        ) {
        super();
        this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.langVal = localStorage.getItem("currentLang")
        this.dataComService.getPassedItemData.subscribe(res => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });
    }

    ngOnInit(): void {
        this.spinner = false;
        if(!this.existingProposalInfo?.stFiscalYearId){
            this.getCatWiseActionPlan(0, this.getFiscalYearId, this.rCategoryId)
        }
    }

    ngOnChanges(changes: SimpleChanges) {

        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'existingProposalInfo': {
                        
                        if (this.existingProposalInfo.id) {
                            this.canSave = true;
                            this.existingProposalInfoId = this.existingProposalInfo.id;
                            this.getCatWiseActionPlan(this.existingProposalInfo.id, this.existingProposalInfo.stFiscalYearId, this.existingProposalInfo.researchCategoryType.id);
                        }
                        break;
                    }
                    case 'brodCastChange': {
                        this.brodCastChange.subscribe(res => {
                            if (res && res.id) {
                                this.canSave = true;
                                this.existingProposalInfoId = res.id;
                                this.getCatWiseActionPlan(res.id, res.stFiscalYearId, res.researchCategoryTypeId);
                            }
                        });
                        break;
                    }
                }
            }
        }
    }

    onSubmit(next: boolean, del: boolean = false) {

        this.formSubmit = true;
        if(this.existingProposalInfoId < 1 || this.existingProposalInfoId == null){
            this._toastrService.warning("Submit the proposal information first!.", "", this.config);
            return;
        }
        
        if (!this.checkRequirdField()) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }

        this.spinner = true;
        this.canSave = false;
        const plans: ResearcherProposalActionPlan[] = this.actionPlanList.map(m => ({ ...m, researcherProposalId: this.existingProposalInfoId }));
    
        this.subscribe$.add(
            this.service.saveList(plans).subscribe(res => {
                if (res.success) {

                    if(del){
                        this.snackbarHelper.deleteSuccessSnackBar()
                    }else{
                        this.snackbarHelper.openSuccessSnackBar();
                    }
                    
                    this.spinner = false;
                    this.canSave = true;
                    this.actionPlanList = res.items;
                    //this.actionPlans = res.items.map(m => ({ ...m, isDeleted: 0 }));
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                    this.canSave = true;
                    this.spinner = false;
                }
            })
        );
    }

    addNewRow() {

    }

    getCatWiseActionPlan(proposalId = 0, stFiscalYearId, researchCatId){
        let baseUrl = environment.ibcs.rpmBackend+'api/st-cat-wise-action-plan/get-by-cat-id/'+stFiscalYearId+'/'+researchCatId;   //Get by Fiscal Year Id and Category Id
        this.api.get(baseUrl).subscribe(res => { 
            if (res.success) {                   
                let $this = this;
                let storeAction = res.items;

                $this.actionPlanList = res.items.map(m =>({ ...m, isAgree:true}));
                if(proposalId != 0)
                {
                    this.service.getByResearcherProposalId(proposalId).subscribe(response => {
                        if (response.success) {
                            this.storeActionPlan = response.items
                            storeAction.forEach((m, index) =>{
                               var a = $this.getActionPlanList(m, index, proposalId);                           
                            })
                        }
                        else{
                            this.setEmptyValue(storeAction, proposalId);

                            // storeAction.forEach((m, index) =>{
                            //     m.catWiseActPlanId = m.id;
                            //     m.id = null;
                            //     m.uuid = null;
                            //     m.researcherProposalId = proposalId;
                            //     m.isAgree = true;
                            //     $this.actionPlanList[index] = m;                   
                            // })
                        }
                    })  
                }
                else{
                    this.setEmptyValue(storeAction);
                }
                             
            }
        });
    
    }

    getActionPlanList(m, index, proposalId){
        let count = 0;
        let $this = this;
        console.log("getActionPlanList proposalId = ", proposalId);

        for (var e of this.storeActionPlan) {
            count++;
            m.researcherProposalId = proposalId;
            m.catWiseActPlanId = m.id;            
            m.isAgree = false;
            if(e.catWiseActPlanId == m.id)
            { 
                count = 0;                  
                m.id =  e.id;  
                m.uuid = e.uuid;                         
                m.isAgree = e.isAgree;             
                $this.actionPlanList[index] = m;
                break;
            }
            if(count == $this.storeActionPlan?.length)
            {
                m.id =  null; 
                m.uuid = null;
                $this.actionPlanList[index] = m;  
            }                 
        }
        
    }

    setEmptyValue(storeAction, proposalId = 0){
        console.log("setEmptyValue proposalId = ", proposalId);

        let $this = this;
        storeAction.forEach((m, index) =>{
            m.catWiseActPlanId = m.id;
            m.id = null;
            m.uuid = null;
            m.researcherProposalId = proposalId;
            m.isAgree = true;
            $this.actionPlanList[index] = m;                   
         })
         console.log("$this.actionPlanList =", $this.actionPlanList);
    }

    deleteNewRelativeForm(i: any) {
        if (this.actionPlans[i].uuid) {
            this.openDialog(i);
        } else {
            this.actionPlans.splice(i, 1);
        }
    }

    private openDialog(i) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.actionPlans[i].isDeleted = 1;
                this.onSubmit(false, true);
            }
            dialogRef.close(true);
        });
    }

    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }


    checkRequirdField(): Boolean {
        let isValied = true;
        this.actionPlans.forEach(f => {
            if (!f.taskName || !f.startDate || !f.endDate) {
                return isValied = false;
            }
        });
        return isValied;
    }

}
