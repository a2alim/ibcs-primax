import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { FormBuilder } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { ResearchProfileMultiFormService } from "../../../../services/research-profile-multi-form.service";
import { locale as lngEnglish } from "../../i18n/en";
import { locale as lngBangla } from "../../i18n/bn";
import {
    addNewIcon,
    nextIcon,
    previousIcon,
    refreshIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { AgreementInstallmentFormModel } from "../../../../models/AgreementInstallmentFormModel";
import { InstallmentTypeServiceService } from "../../../../../settings/services/installment-type-service.service";
import { AgreementWithResearcherServiceService } from "../../../../services/agreement-with-researcher-service.service";

@Component({
    selector: 'app-agreement-installment-tab',
    templateUrl: './agreement-installment-tab.component.html',
    styleUrls: ['./agreement-installment-tab.component.scss']
})
export class AgreementInstallmentTabComponent implements OnInit {

    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @Input() numberOfInstallment2: number;

    agreementInstallmentFormModels: AgreementInstallmentFormModel[] = new Array();
    certificateFiles: File[] = new Array();

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    isUpdatedAction: boolean;
    isVerifiedNid: boolean = false;
    isVerifiedTin: boolean = false;

    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    installmentTypeList: any[] = new Array();
    initialGrandTotal: any = localStorage.getItem('grand_amount')
    agreementWithResearcherId: any = localStorage.getItem('agreement_with_researcher_id')
    isGrandTotal: boolean;
    isEmpty:boolean=false;

    agreementId: any;
    isEditable: boolean = false;
    spinner: boolean = false;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _installmentTypeServiceService: InstallmentTypeServiceService,
        private agreementWithResearcher: AgreementWithResearcherServiceService,
        private _agreementWithResearcherServiceService: AgreementWithResearcherServiceService,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private _router: Router
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);


    }

    ngOnInit(): void {
        this.agreementId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.agreementId != null) {
            this.isEditable = true;
        } else {
            //Set Default
            for (let i = 0; i < (+this.numberOfInstallment2); i++) {
                if (i == 0) {
                    this.isGrandTotal = true;
                }
                this.addNewForm();
            }
        }
        this.getInstallmentTypeListFull();
        //console.log(this.isEditable)
        if (this.isEditable) {

            this.getAllTabData();

        }
    }

    getAllTabData() {
        this._agreementWithResearcherServiceService.agreementAllDataResponse.asObservable().subscribe(response => {
            if (response != null) {
                if(response.obj.tabTwo.length==0){
                    this.isEmpty=true;
                    this.initialGrandTotal=response.obj.tabOne.totalGrantAmount;
                    this.agreementWithResearcherId=response.obj.tabOne.id;
                    for (let i = 0; i < (+this.numberOfInstallment2); i++) {
                        if (i == 0) {
                            this.isGrandTotal = true;
                        }
                        this.addNewForm();
                    }
                    return ;
                }

                //console.log('response.obj.tabTwo ==== >>>> ', response.obj.tabTwo);
                response.obj.tabTwo.forEach(data => {
                    this.agreementInstallmentFormModels.push({
                        id: data.id,
                        uuid: data.uuid,
                        agreementId: data.agreementWithResearcherId.id,
                        grandTotal: data.tkAmount,
                        stInstallmentTypeId: data.stInstallmentTypeId,
                        percentageAmount: data.percentageAmount,
                        tkAmount: data.tkAmount
                    })
                });
                //console.log(response.obj.tabTwo)
            }

        })

    }

    getDataByUuid(uuid: string) {
        this._researchProfileMultiFormService.profileView(uuid).subscribe(data => {
            this.agreementInstallmentFormModels = data.educationInfos
        }, error => {
            console.log('Successfully not saved')

        })
    }

    save() {
        if (!this.isEditable) {
            this.spinner = true;
            this.agreementInstallmentFormModels.forEach(data => {
                data.agreementId = this.agreementWithResearcherId
                this.agreementWithResearcher.saveInstallment(data).subscribe(res => {
                    this.spinner = false;
                    if (res.success) {
                        this._toastrService.success(res.message, "Success!", this.config);
                        this._router.navigate(['/agreement-process'])
                    } else {                        
                        this._toastrService.error("Save unsuccessful", "Error", this.config);
                    }
                }, error => {
                    this._toastrService.error("Save unsuccessful", "Error", this.config);
                }
                )
            })
        }
       else if (this.isEditable && this.isEmpty) {
            this.spinner = true;
            this.agreementInstallmentFormModels.forEach(data => {
                data.agreementId = this.agreementWithResearcherId
                this.agreementWithResearcher.saveInstallment(data).subscribe(res => {
                    this.spinner = false
                        if (res.success) {
                            this._toastrService.success(res.message, "Success!", this.config);
                            this._router.navigate(['/agreement-process'])
                        } else {
                            this._toastrService.error("Save unsuccessful", "Error", this.config);
                        }
                    }, error => {
                        this._toastrService.error("Save unsuccessful", "Error", this.config);
                    }
                )
            })
        }

        else {
            this.spinner = true;
            this.agreementInstallmentFormModels.forEach(data => {
                // data.stInstallmentTypeId = this.installmentTypeList.filter(res=> res.id === data.stInstallmentTypeId)[0]
                // console.error("this.agreementInstallmentFormModels:", data)
                this.agreementWithResearcher.updateInstallment(data).subscribe(res => {
                    this.spinner = false
                    if (res.success) {
                        this._toastrService.success(res.message, "Success!", this.config);
                        this._router.navigate(['/agreement-process'])
                    } else {
                        this._toastrService.error("Save unsuccessful", "Error", this.config);
                    }
                }, error => {
                    this._toastrService.error("Save unsuccessful", "Error", this.config);
                }
                )
            })

        }
    }

    saveAndNext() {
        this.save();
        this.nextTab();
    }

    handleFileInput(file: FileList, index: number) {
        this.certificateFiles.push(file.item(0))
    }

    getInstallmentTypeListFull() {
        this._installmentTypeServiceService.getAll().subscribe(
            res => {
                this.installmentTypeList = res.items ? res.items : [];
            }
        );
    }


    addNewForm() {
        this.agreementInstallmentFormModels.push(
            {
                id: null,
                uuid: null,
                agreementId: null,
                grandTotal: this.initialGrandTotal,
                stInstallmentTypeId: null,
                percentageAmount: null,
                tkAmount: null
            }
        )
    }

    deleteFormByIndex(index: number) {
        this.agreementInstallmentFormModels.splice(index, 1)
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

    modifyGrandTotal(value: any, index: any) {
        const parcentageCalculateBalance: number = ((this.initialGrandTotal) * value) / 100;
        const remainGrandTotalBalance: number = +(this.initialGrandTotal) - parcentageCalculateBalance;

        this.agreementInstallmentFormModels[index].grandTotal = remainGrandTotalBalance;
        this.agreementInstallmentFormModels[index].tkAmount = parcentageCalculateBalance;

        if (this.isPercentageAmountValid()) {
            this._toastrService.error("Insufficient amount!", "Error", this.config);
            this.agreementInstallmentFormModels[index].tkAmount = 0;
        }


    }

    private isPercentageAmountValid() {
        let sum: number = 0;
        for (let i = 0; i < this.numberOfInstallment2; i++) {
            sum = sum + +(this.agreementInstallmentFormModels[i].tkAmount)
        }
        if (sum > this.initialGrandTotal) {
            return true;
        }
        return false;
    }
}
