import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from "@angular/router";
import { MIN_EDITOR_CONFIG } from 'app/main/core/constants/editor-config';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import {
    downloadIcon,
    nextIcon,
    previousIcon,
    printIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { ToastrService } from 'ngx-toastr';
import { FuseTranslationLoaderService } from "../../../../../../core/services/translation-loader.service";
import { PredefinedTemplateServiceService } from "../../../../../settings/services/predefined-template-service.service";
import { TemplateTypeServiceService } from "../../../../../settings/services/template-type-service.service";
import { InstallmentProcessModel } from "../../../../models/InstallmentProcessModel";
import { InstallmentProcessService } from "../../../../services/installment-process.service";
import { locale as lngBangla, locale as lngEnglish } from "../../i18n/en";

@Component({
    selector: 'app-create-letter',
    templateUrl: './create-letter.component.html',
    styleUrls: ['./create-letter.component.scss']
})
export class CreateLetterComponent implements OnInit {
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();
    @Output() m2_installment_process_id = new EventEmitter<number>();
    @Output() isEdit = new EventEmitter<string>();
    @Output() installment = new EventEmitter<number>();
    @Output() amount = new EventEmitter<number>();
    @Output() installmentName = new EventEmitter<string>();
    @Output() processUuId = new EventEmitter<string>();
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    nextIcon = nextIcon;
    saveIcon = saveIcon;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    uuid: any;
    mode: any;
    proposal: any;
    installmentProcessModel: InstallmentProcessModel = new InstallmentProcessModel();
    templateType: [] = [];
    predefinedTemplates: any;
    isDisabled: boolean = false;
    spinner: boolean = false;
    loginUserInfo: any
    installmentPlaceholder: any;
    disableSaveBtn: boolean = false;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private toastr: ToastrService,
                private dateAdapter: DateAdapter<Date>,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private Installmentprocess: InstallmentProcessService,
                private templatetypeservice: TemplateTypeServiceService,
                private predefinedTemplate: PredefinedTemplateServiceService,
                private storageService: StorageService) {

        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.dateAdapter.setLocale('en-GB');//dd/MM/yyyy
    }

    ngOnInit(): void {
        this.loginUserInfo = this.storageService.getUserData();
        this.uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
        this.mode = this.activatedRoute.snapshot.paramMap.get('mode');
        if (this.mode == 'edit') {
            this.isDisabled = true;
            this.loadInstallmentByUUid();
            this.isEdit.emit('edit');

        } else {
            this.getProposalId(this.uuid);
        }
        this.getTemplateType();
        //

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

    saveAndNext() {
        this.save()
        this.nextTab();
    }

    save() {
        this.Installmentprocess.createLetter(this.installmentProcessModel).subscribe(res => {

            if (res.success) {
                this.m2_installment_process_id.emit(res.obj.id);
                this.processUuId.emit(res.obj.uuid);
                this.installment.emit(res.obj.percentageAmount);
                this.amount.emit(res.obj.tkAmount);
                this.Installmentprocess.processId = res.obj.id;
                localStorage.setItem("m2_installment_process_id", res.obj.id);
                this.installmentProcessModel = null;
                this.installmentProcessModel = res.obj;
                this.installmentProcessModel.researchtitle = this.proposal?.proposal?.researchTitle;
                this.installmentProcessModel.proposalId = this.proposal?.proposal?.id;

                const parse = JSON.parse(res.obj.installmentTypes);

                this.installmentProcessModel.installmentTypesData = parse.map(data => data.id)

                this.toastr.success(res.message, "", this.config);

            } else {
                this.toastr.error(res.message, "", this.config)
            }

        }, error => {
            this.toastr.error('Http Error Happened !.', "", this.config)
        })

    }

    //get proposal id by uuid
    getProposalId(uuid) {
        this.spinner = true;
        this.Installmentprocess.getProposal(uuid).subscribe(res => {
            if (res) {
                if (this.mode == 'edit') {
                    this.proposal = res.obj;
                    //this.getInstallmentNameById(res.obj);
                }
                if (res.obj.agreement.approvalStatus === 1) {
                    this.proposal = res.obj;
                    this.installmentProcessModel.researchtitle = res?.obj?.proposal?.researchTitle;
                    this.installmentProcessModel.proposalId = res?.obj?.proposal?.id;
                    localStorage.setItem("proposalIdForInstallment", res?.obj?.proposal?.id);
                    this.spinner = false;
                } else {
                    this.disableSaveBtn = true;
                    this.toastr.warning('Agreement Not Approved Yet!', "", this.config)
                    this.spinner = false;
                }
            }

        }, error => {
            this.toastr.error('Http Error Happened !', "", this.config)
            this.spinner = false;
        })

    }


    changeIstallmentType($event: MatSelectChange) {
        this.installmentPlaceholder = [];
        let values = $event.value;
        let percentage = 0;
        let amount = 0
        let prc = "";
        let tAmount = "";

        values.forEach(data => {
            const installment = this.proposal.installments.find(element => element.stInstallmentTypeId === data);
            const type = this.proposal.installmentsType.find(installmentData => installmentData.id === installment.stInstallmentTypeId);

            this.installmentPlaceholder.push({
                "id": type?.id,
                "installment": type?.installmentType,
                "percentage": installment?.percentageAmount,
                "amount": installment?.tkAmount
            });

            if (prc === "") {
                prc = installment?.percentageAmount;
            } else {
                prc += ',' + installment?.percentageAmount;
            }
            if (tAmount === "") {
                tAmount = installment?.tkAmount;
            } else {
                tAmount += ',' + installment?.tkAmount;
            }

            percentage += installment?.percentageAmount;
            amount += installment?.tkAmount

        });

        const installmentMapData = this.installmentPlaceholder.map(name => {
            let data = "";
            if (data === "") {
                data = name.installment;
            } else {
                data += name.installment + ",";
            }

            return data;

        });

        this.installmentName.emit(installmentMapData)
        this.installmentProcessModel.prcAmount = prc;
        this.installmentProcessModel.totalAmount = tAmount;
        this.installmentProcessModel.installmentTypes = JSON.stringify(this.installmentPlaceholder)
        this.installmentProcessModel.percentageAmount = percentage;
        this.installmentProcessModel.tkAmount = amount;


    }


    // changeIstallmentType($event: MatSelectChange) {
    //     let status = $event.value.id;
    //     if (status != null || status != "") {
    //         console.log($event);
    //         this.installmentProcessModel.stInstallmentTypeId = $event.value.id;
    //         this.installmentName.emit($event.value.installmentType);
    //         this.proposal.installments.forEach(element => {
    //             if (element.stInstallmentTypeId === status) {
    //                 this.installmentProcessModel.percentageAmount = element?.percentageAmount;
    //                 this.installmentProcessModel.tkAmount = element?.tkAmount;
    //             }
    //         });
    //     }
    //
    // }

    //get template Type

    getTemplateType() {
        this.templatetypeservice.getAllActive().subscribe(res => {
            if (res) {
                this.templateType = res.items;
            }

        }, error => {
            this.toastr.error('Http Error Happened Template Type !', "", this.config)
        })
    }

    changeTemplateType($event: MatSelectChange) {
        let status = $event.value;

        if (status != null || status != "") {
            this.predefinedTemplate.getByTemplateTypeId(status).subscribe(res => {
                if (res.success) {
                    this.predefinedTemplates = res.items;
                }

            }, error => {
                this.toastr.error('Http Error Happened Predefined template !', "", this.config)
            })
        }


    }

    changePredefinedTemplateType($event: MatSelectChange) {

        let status = $event.value;

        if (status != null || status != "") {
            this.predefinedTemplates.forEach(res => {
                if (res.id === status) {
                    this.installmentProcessModel.mailBody = res?.header + res?.footer;
                }

            })
        }


    }

    ////////////for update///////////////
    loadInstallmentByUUid() {
        this.spinner = true;
        this.Installmentprocess.getInstallmentProcessByUuid(this.uuid).subscribe(res => {
            this.getProposalId(res.obj.m1ResearcherProposalId.uuid)
            this.bindData(res)
            this.spinner = false;
        })
    }

    bindData(res) {
        this.m2_installment_process_id.emit(res.obj.id);
        this.Installmentprocess.processId = res.obj.id;
        localStorage.setItem("m2_installment_process_id", res.obj.id);
        this.installment.emit(res.obj.percentageAmount);
        this.amount.emit(res.obj.tkAmount);
        this.installmentProcessModel = null;
        this.installmentProcessModel = res.obj;
        const parse = JSON.parse(res.obj.installmentTypes);
        this.installmentProcessModel.installmentTypesData = parse.map(data => data.id)
        this.installmentPlaceholder=parse;


        const installmentMapData = parse.map(name => {
            let data = "";
            if (data === "") {
                data = name.installment;
            } else {
                data += name.installment + ",";
            }

            return data;

        });
        this.installmentName.emit(installmentMapData);

        //this.getInstallmentNameById(res.obj.stInstallmentTypeId)
        // this.installmentProcessModel.researchtitle = this.proposal?.proposal?.researchTitle;
        // this.installmentProcessModel.proposalId = this.proposal?.proposal?.id;
    }

    getInstallmentNameById(proposal) {
        proposal.installmentsTypeAll.forEach(res => {
            if (res?.id === this.installmentProcessModel.stInstallmentTypeId) {
                this.installmentName.emit(res.installmentType);
            }
        })
    }

    back() {
        this.router.navigate(['installment-process']);

    }
}
