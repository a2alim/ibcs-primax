import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { locale as lngEnglish } from "../i18n/en";
import { locale as lngBangla } from "../i18n/bn";
import { downloadIcon, noteIcon, previousIcon, printIcon, saveIcon } from '../../../constants/button.constants';
import { FiscalYearServiceService } from "../../../../settings/services/fiscal-year-service.service";
import { LatterModel } from "../../../models/LatterModel";
import { LatterService } from "../../../services/latter.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { ResearcherProposalService } from "../../../services/researcher-proposal.service";
import { MatSelectChange } from '@angular/material/select';
import { TemplateTypeServiceService } from 'app/main/modules/settings/services/template-type-service.service';
import { PredefinedTemplateServiceService } from 'app/main/modules/settings/services/predefined-template-service.service';
import {MIN_EDITOR_CONFIG} from "../../../../../core/constants/editor-config";

@Component({
    selector: 'app-new-latter-add',
    templateUrl: './new-latter-add.component.html',
    styleUrls: ['./new-latter-add.component.scss']
})
export class NewLatterAddComponent implements OnInit {


    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    saveIcon = saveIcon;

    /*----/Button---*/
    fiscalYearList: any[] = [];
    researchTitleNames: any[] = [];
    preDefineTemplateList: any[] = [];
    templateType: [] = [];


    latter: LatterModel = new LatterModel();
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };
    isEditable: boolean = false;
    letterId: string;
    fiscalYearId: number;
    formGroup: any;
    emptyField: any = 'sdfsdf'
    researcherProposalList: any[] = new Array();

    spinner: boolean = false;
    spinner1: boolean = false;
    spinner2: boolean = false;
    spinner3: boolean = false;
    spinner4: boolean = false;
    spinner5: boolean = false;
    spinner6: boolean = false;
    spinner7: boolean = false;
    spinner8: boolean = false;
    spinner9: boolean = false;
    spinner10: boolean = false;
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
    searchTerm: string = '';

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private fiscalyearservice: FiscalYearServiceService,
        private _toastrService: ToastrService,
        private _researcherProposalService: ResearcherProposalService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _latterService: LatterService,
        private templatetypeservice: TemplateTypeServiceService,
        private _predefinedTemplateServiceService: PredefinedTemplateServiceService,) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);


        this.letterId = this._activatedRoute.snapshot.paramMap.get('id');
        if (this.letterId != null) {
            this.isEditable = true;
        }

    }

    ngOnInit(): void {
        this.getFiscalyearList()
        this.getLatterList()

        if (this.isEditable) {
            this.getLatterById();
        }

        this.getPredefinedTemplateList();
        this.getTemplateType();
    }

    filterOptions(): any[] {
        if (!this.searchTerm) {
            return this.researchTitleNames;
        }

        const filteredOptions = this.researchTitleNames.filter(option =>
            option.researchTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
        );

        return filteredOptions;
    }

    getLatterById() {
        this.spinner = true;
        this._latterService.getLetterById(this.letterId).subscribe(value => {
            if (value.success) {
                this.latter = value.obj;
                this.fiscalYearId = value.obj.researcherProposalId.stFiscalYearId;
                this.latter.researcherProposalId = value.obj.researcherProposalId.id;
                this.spinner = false;
            }
        }, error => {
            this._toastrService.error('Data Not Found!');
            this.spinner = false;
        })
    }

    setProposalCreatedByValue(event: any) {
        let data = this.researchTitleNames.filter((val) => {
            return event.value === val.id
        });
    }

    getFiscalyearList() {
        this.spinner1 = true;
        this.fiscalyearservice.getAllActive().subscribe(
            res => {
                this.fiscalYearList = res.items ? res.items : [];
                this.spinner1 = false;
            },
            error => {
                this.spinner1 = false;
            }
        );
    }

    save() {
        //this.latter.researcherProposalId =
        if (!this.checkRequirdField()) {
            return;
        }

        if (!this.isEditable) {
            this.spinner2 = true;
            this._latterService.saveData(this.latter).subscribe(data => {
                if (data.success) {
                    this._router.navigate(['/letter/view/' + data.obj.id])
                    this._toastrService.success(data.message, "Success!", this.config);
                } else {
                    this._toastrService.error(data.message, "", this.config);
                }
                this.spinner2 = false;
            }, error => {
                this._toastrService.error('Something went wrong!', "", this.config);
                this.spinner2 = false;
            })
        } else {
            this.spinner2 = true;
            this.latter.rmsUserSignatureId = this.latter.rmsUserSignatureId.id
            this._latterService.editData(this.letterId, this.latter).subscribe(data => {
                if (data.success) {
                    this._router.navigate(['/letter/view/' + data.obj.id])
                    this._toastrService.success(data.message, "Success!", this.config);
                } else {
                    this._toastrService.error(data.message, "", this.config);
                }
                this.spinner2 = false;
            }, error => {
                this._toastrService.error('Something went wrong!', "", this.config);
                this.spinner2 = false;
            })
        }

    }

    findResearcherNamesByFiscalYear(event: any) {
        this.researchTitleNames = this.researcherProposalList.filter(rp => rp.fiscalYear.id === event.value).map(m => {
            console.log("m == ", m);
            m.researchTitle = `${m.researchTitle} ( ${m.researcherProfilePersonalInfoDto?.userDto?.name} )`;
            return m;
        });
    }

    private getLatterList() {
        this.spinner4 = true;
        this.researcherProposalList = [];
        this._researcherProposalService.getAll().subscribe(value => {
            value.items.forEach(item => {
                this.researcherProposalList.push(item);
            });
            this.spinner4 = false;
        }, error => {
            this.spinner4 = false;
        })
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
                    }
                    this.spinner5 = false;
                },
                error => {
                    this._toastrService.error('Http Error Happened Predefined template !.', "", this.config);
                    this.spinner5 = false;
                })
        }

    }

    selectionchangeForSemener(event: any, tag: any) {
        tag === 'p1' ? this.latter.mailBody = event.value.header : '';
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
        this.spinner5 = true;
        this.templatetypeservice.getAllActive().subscribe(
            res => {
                if (res) {
                    this.templateType = res.items;
                }
                this.spinner5 = false;
            },
            error => {
                this._toastrService.error('Http Error Happened Template Type !.', "", this.config);
                this.spinner5 = false;
            })
    }


    // (latter.subject | required) ||
    // !(latter.mailBody | required) ||
    // !(fiscalYearId | required) ||
    // !(latter.researcherProposalId | required


    checkRequirdField(): Boolean {
        let isValied = true;
        if (!this.latter.subject || !this.latter.mailBody || !this.fiscalYearId || !this.latter.researcherProposalId) {
            return isValied = false;
        }
        return isValied;
    }
}
