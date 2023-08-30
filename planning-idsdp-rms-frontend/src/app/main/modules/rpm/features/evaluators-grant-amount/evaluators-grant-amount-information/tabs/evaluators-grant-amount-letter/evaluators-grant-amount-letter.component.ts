import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {UnsubscribeAdapterComponent} from "../../../../../../../core/helper/unsubscribeAdapter";
import {FuseTranslationLoaderService} from "../../../../../../../core/services/translation-loader.service";
import {RmsEvaluatorsGrantAmountLetterService} from "../../../../../services/rms-evaluators-grant-amount-letter.service";
import {FiscalYearServiceService} from "../../../../../../settings/services/fiscal-year-service.service";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {TemplateTypeServiceService} from "../../../../../../settings/services/template-type-service.service";
import {PredefinedTemplateServiceService} from "../../../../../../settings/services/predefined-template-service.service";
import {EvaluatorsGrantAmountLetter} from "../../../../../models/EvaluatorsGrantAmountLetter";
import {nextIcon, saveIcon } from 'app/main/modules/rpm/constants/button.constants';
import {MatSelectChange} from "@angular/material/select";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {MIN_EDITOR_CONFIG} from "../../../../../../../core/constants/editor-config";

@Component({
    selector: 'app-evaluators-grant-amount-letter',
    templateUrl: './evaluators-grant-amount-letter.component.html',
    styleUrls: ['./evaluators-grant-amount-letter.component.scss']
})
export class EvaluatorsGrantAmountLetterComponent extends UnsubscribeAdapterComponent implements OnInit, OnChanges {


    @Input() existingEvaluatorGrantAmountLetter: EvaluatorsGrantAmountLetter;
    @Input() brodCastChange: BehaviorSubject<any>;
    @Output() nextStep = new EventEmitter<boolean>();

    spinner = true;
    letter: EvaluatorsGrantAmountLetter = new EvaluatorsGrantAmountLetter();
    fiscalYearsList: any[];
    templateTypeList: any[];
    topPredefinedTemplateTypeList: any[];
    bottomPredefinedTemplateTypeList: any[];

    /*----Button---*/
    saveIcon = saveIcon;
    nextIcon = nextIcon;
    /*----/Button---*/
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: RmsEvaluatorsGrantAmountLetterService,
                private templateTypeServiceService: TemplateTypeServiceService,
                private predefinedTemplateTypeService: PredefinedTemplateServiceService,
                private fiscalYearService: FiscalYearServiceService,
                private snackbarHelper: SnackbarHelper,) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getFiscalYears();
        this.getTemplateType();
        this.spinner = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'existingEvaluatorGrantAmountLetter': {
                        if (this.existingEvaluatorGrantAmountLetter?.id) {
                            this.letter = this.existingEvaluatorGrantAmountLetter;
                        }
                    }
                }
            }
        }
    }

    private getFiscalYears() {
        this.subscribe$.add(
            this.fiscalYearService.getAllActive().subscribe(res => {
                this.fiscalYearsList = res.items ? res.items : [];
            })
        );
    }

    private getTemplateType() {
        this.subscribe$.add(
            this.templateTypeServiceService.getAllActive().subscribe(res => {
                this.templateTypeList = res.items ? res.items : [];
            })
        );
    }

    onChangeTemplateType($event: MatSelectChange, addIn: string) {
        this.subscribe$.add(
            this.predefinedTemplateTypeService.getByTemplateTypeId($event.value).subscribe(res => {
                if (addIn === 'top') {
                    this.topPredefinedTemplateTypeList = res.items ? res.items : [];
                } else {
                    this.bottomPredefinedTemplateTypeList = res.items ? res.items : [];
                }
            })
        );
    }

    onChangePredefinedTemplateType($event: MatSelectChange, addIn: string) {
        if (addIn === 'top') {
            const type  = this.topPredefinedTemplateTypeList.find(f => f.id === $event.value);
            console.log(type);
            this.letter.topContent = type?.header ? type.header : '';
            // this.letter.topContent = this.topPredefinedTemplateTypeList.find(f => f.id === $event.value).header;
        } else {
            const type  = this.topPredefinedTemplateTypeList.find(f => f.id === $event.value);
            console.log(type);
            this.letter.bottomContent = type?.header ? type.header : '';
            // this.letter.bottomContent = this.topPredefinedTemplateTypeList.find(f => f.id === $event.value).header;
        }
    }

    onSubmit(next: boolean) {
        if (this.letter.id) {
            this.onUpdate(next)
        } else {
            this.onSave(next);
        }
    }

    onSave(next: boolean) {
        this.spinner = true;
        this.service.create(this.letter).subscribe(
            response => {
                if (response.success) {
                    this.brodCastChange.next(response.obj);
                    this.letter = response.obj;
                    this.snackbarHelper.openSuccessSnackBar();
                    if (next) {
                        this.nextTab();
                    }
                }
                this.spinner = false;
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
            }
        );
    }

    onUpdate(next: boolean) {
        this.spinner = true;
        this.service.update(this.letter).subscribe(
            response => {
                if (response.success) {
                    this.letter = response.obj;
                    if (next) {
                        this.nextTab();
                    }
                }
                this.spinner = false;
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
            }
        );
    }

    nextTab() {
        this.nextStep.emit(true);
    }
}
