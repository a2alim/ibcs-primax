import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {
    downloadIcon,
    noteIcon,
    previousIcon,
    printIcon,
    saveIcon
} from 'app/main/modules/rpm/constants/button.constants';
import { FiscalYearServiceService } from "../../../../../settings/services/fiscal-year-service.service";
import { ToastrService } from "ngx-toastr";
import { ResearcherProposalService } from "../../../../../rpm/services/researcher-proposal.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TemplateTypeServiceService } from "../../../../../settings/services/template-type-service.service";
import { PredefinedTemplateServiceService } from "../../../../../settings/services/predefined-template-service.service";
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { MatSelectChange } from "@angular/material/select";
import { ProposalService } from "../../../../services/proposal.service";
import { AwardLatterModel } from "../../../../models/AwardLatterModel";
import { AwardLatterService } from "../../../../services/award-latter.service";
import { dataNotFount, deleteFailed, deleteSuccess, saveFailed, saveSuccess, sentSuccess, updateFailed, updateSuccess } from 'app/main/modules/rpm/constants/button.constants';
import { ConfigurationService } from "../../../../../settings/services/configuration.service";
import { MIN_EDITOR_CONFIG } from "../../../../../../core/constants/editor-config";


@Component({
    selector: 'app-add-new-award-letter',
    templateUrl: './add-new-award-letter.component.html',
    styleUrls: ['./add-new-award-letter.component.scss']
})
export class AddNewAwardLetterComponent implements OnInit {


    spinner: boolean;
    spinner1: boolean;
    spinner2: boolean;
    spinner3: boolean;
    spinner4: boolean;
    spinner5: boolean;
    spinner6: boolean;
    spinner7: boolean;


    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    saveIcon = saveIcon;

    /*----/Button---*/
    fiscalYearList: any[] = [];
    proposalList: any[] = [];
    preDefineTemplateList: any[] = [];
    templateType: [] = [];

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    latter: AwardLatterModel = new AwardLatterModel();

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    isEditable: boolean = false;
    letterId: string;
    fiscalYearId: number;
    formGroup: any;

    emptyField: any = 'sdfsdf'

    saveSuccess = saveSuccess;
    saveFailed = saveFailed;
    updateSuccess = updateSuccess;
    updateFailed = updateFailed;
    deleteSuccess = deleteSuccess;
    deleteFailed = deleteFailed;
    sentSuccess = sentSuccess;
    dataNotFount = dataNotFount;
    activeFiscalYear: any[];
    holderEditProposal: any;

    trainingProposalList: any[] = new Array();

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private fiscalyearservice: FiscalYearServiceService,
        private _toastrService: ToastrService,
        private _researcherProposalService: ResearcherProposalService,
        private _router: Router,
        private _configurationService: ConfigurationService,
        private _proposalService: ProposalService,
        private _activatedRoute: ActivatedRoute,
        private _latterService: AwardLatterService,
        private templatetypeservice: TemplateTypeServiceService,
        private _predefinedTemplateServiceService: PredefinedTemplateServiceService,
        private _fiscalYearService: FiscalYearServiceService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);


        this.letterId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.letterId != null) {
            this.isEditable = true;
        }

    }

    ngOnInit(): void {
        this.getFiscalyearList();
        this.getPredefinedTemplateList();
        this.getTemplateType();
        //this.getProposals();

        if (this.isEditable) {
            this.getAwardLatterById(res => {
                if (res) {
                    this.holderEditProposal = this.latter.proposalId;
                    this.getAllActiveFiscalYears();
                    this.getProposals(data => {
                        if (data) {
                            this.findTrainingTitleByFiscalYear(this.latter.fiscalYearId)
                        }
                    });

                }
            });
        } else {
            this.getProposals(res => {
                if (res) {
                    console.log('called for create Mode')
                }
            });
        }
    }

    getAllActiveFiscalYears() {
        this.spinner = true;
        this._fiscalYearService.getAllActive().subscribe(
            res => {
                res.success ? this.activeFiscalYear = res.items : [];
                this.spinner = false;
            });
    }

    getAwardLatterById(callback) {
        this.spinner1 = true;
        this._latterService.getLetterById(this.letterId).subscribe(value => {
            this.latter = value;
            this.latter.proposalId = value.proposalModel.id;
            this.spinner1 = false;
            callback(true);
        }, error => {
            callback(false);
            this.spinner1 = false;
        });
        callback(false);
    }

    getFiscalyearList() {
        this.spinner3 = true;
        this._configurationService.getAllFiscalYearByFinalCopy().subscribe(
            res => {
                this.fiscalYearList = res.items;
                this.spinner3 = false;
            },
            error => {
                console.log(error);
                this.spinner3 = false;
            }
        )
    }

    save() {
        if (!this.isEditable) {
            this.spinner4 = true;
            this._latterService.saveData(this.latter).subscribe(data => {
                this._router.navigate(['/ti-award-letter'])
                this._toastrService.success(saveSuccess, "Success!", this.config);
                this.spinner4 = false;
            }, error => {
                this._toastrService.error(saveFailed, "Error!", this.config);
                this.spinner4 = false;
            })
        } else {
            this.spinner4 = true;
            this._latterService.editData(this.letterId, this.latter).subscribe(data => {
                this._router.navigate(['/ti-award-letter'])
                this._toastrService.success(updateSuccess, "Success!", this.config);
                this.spinner4 = false;
            }, error => {
                this._toastrService.error(updateFailed, "Error!", this.config);
                this.spinner4 = false;
            })
        }

    }

    findTrainingTitleByFiscalYear(fiscalYearId: any) {
        this.proposalList = this.trainingProposalList.filter(rp => rp.fiscalYearId === fiscalYearId);
    }

    setTrainingNameForEdit(fiscalYearId: any) {
        this.proposalList = this.trainingProposalList.filter(rp => rp.fiscalYearId === fiscalYearId);
        this.latter.proposalId = null;
    }


    back() {
        this._router.navigate(['letter']);
    }


    changeTemplateType($event: MatSelectChange) {

        let status = $event.value;
        if (status != null || status != "") {
            this.spinner5 = true;
            this._predefinedTemplateServiceService.getByTemplateTypeId(status).subscribe(
                res => {
                    if (res.success) {
                        this.preDefineTemplateList = res.items;
                        this.spinner5 = false;
                    }
                    this.spinner5 = false;
                },
                error => {
                    this.spinner5 = false;
                });
        }

    }

    selectionchangeForSemener(event: any, tag: any) {
        tag === 'p1' ? this.latter.mailBody = event.value.header : '';
    }

    private getProposals(callback) {
        this.spinner5 = true;
        this._proposalService.getProposals(2000, 0).subscribe(
            res => {
                this.trainingProposalList = res.data;
                callback(true);
                this.spinner5 = false;
            },
            error => {
                console.log(error);
                callback(false);
                this.spinner5 = false;
            }
        )
        callback(false);
    }

    getPredefinedTemplateList() {
        this.spinner6 = true;
        this._predefinedTemplateServiceService.getAll().subscribe(
            res => {
                this.preDefineTemplateList = res.items ? res.items : [];
                this.spinner6 = false;
            },
            error => {
                this.spinner6 = false;
            }
        );

    }

    getTemplateType() {
        this.spinner7 = true;
        this.templatetypeservice.getAllActive().subscribe(
            res => {
                if (res) {
                    this.templateType = res.items;
                    this.spinner7 = false;
                }

            },
            error => {
                this.spinner7 = false;
            })
    }

    openDialogForStatus(data: MatSelectChange) {
        if (this.isEditable) {
            if (this.holderEditProposal != data.value) {
                this._latterService.checkProposalIsExist(this.latter.fiscalYearId, data.value).subscribe(res => {
                    if (res.success) {
                        this._toastrService.warning(res.message, "Alert!", this.config);
                        this.latter.proposalId = this.holderEditProposal
                    }
                })
            }
        } else {
            this._latterService.checkProposalIsExist(this.latter.fiscalYearId, data.value).subscribe(res => {
                if (res.success) {
                    this._toastrService.warning(res.message, "Alert!", this.config);
                    this.latter.proposalId = null
                }
            })
        }

    }
}
