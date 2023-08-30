import {Component, OnInit} from '@angular/core';
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {UnsubscribeAdapterComponent} from "../../../../../../core/helper/unsubscribeAdapter";
import {previousIcon, saveIcon} from '../../../../constants/button.constants';
import {ResearcherPresentation} from "../../../../models/ResearcherPresentation";
import {ResearcherPresentationService} from "../../../../services/researcher-presentation.service";
import {SeminarService} from "../../../../services/seminar.service";
import {ResearcherProposal} from "../../../../models/ResearcherProposal";
import {CommonTypeService} from "../../../../../settings/services/common-type.service";
import {FORM_TYPES_NO} from "../../../../../settings/enum-list.enum";
import {ERROR, OK} from "../../../../../../core/constants/message";

@Component({
    selector: 'app-add-researcher-presentation',
    templateUrl: './add-researcher-presentation.component.html',
    styleUrls: ['./add-researcher-presentation.component.scss']
})
export class AddResearcherPresentationComponent extends UnsubscribeAdapterComponent implements OnInit {

    spinner1 = false;
    spinner2 = false;
    spinner3 = false;
    spinner4 = false;
    spinner5 = false;
    spinner6 = false;    

    seminarUuid: string;
    seminarTimeScheduleList = [];
    presentationType = [];
    presentationStatus = [];
    presentation = new ResearcherPresentation();
    selectedProposal: ResearcherProposal;
    saveDisable: boolean;
    saveIcon = saveIcon;
    previousIcon = previousIcon;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: ResearcherPresentationService,
                private seminarService: SeminarService,
                private commonTypeService: CommonTypeService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private snackbarHelper: SnackbarHelper) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.seminarUuid = params['seminarUuid'];
            this.getResearchPresentationBySeminarId();
            this.getResearchTitleListBySeminarId();
            this.getPresentationType();
            this.getPresentationStatus();
        });
    }

    private getResearchPresentationBySeminarId() {
        this.spinner1 = true;
        this.subscribe$.add(
            this.service.getResearchPresentationBySeminarUuid(this.seminarUuid).subscribe(res => {
                if (res.success && res.obj) {
                    this.presentation = res.obj;
                    this.selectedProposal = this.presentation.researcherProposalDto;
                }
                this.spinner1 = false;
            })
        );
    }

    private getPresentationType() {
        this.spinner2 = true;
        this.subscribe$.add(
            this.commonTypeService.findAllByActiveData(FORM_TYPES_NO.PRESENTATION_TYPE).subscribe(res => {
                if (res) {
                    this.presentationType = res;
                }
                this.spinner2 = false;
            })
        );
    }

    private getPresentationStatus() {
        this.spinner3 = true;
        this.subscribe$.add(
            this.commonTypeService.findAllByActiveData(FORM_TYPES_NO.PRESENTATION_STATUS).subscribe(res => {
                if (res) {
                    this.presentationStatus = res;
                }
                this.spinner3 = false;
            })
        );
    }

    private getResearchTitleListBySeminarId() {
        this.spinner4 = true;
        this.subscribe$.add(
            this.service.getResearchTittleListFindBySeminarUuid(this.seminarUuid).subscribe(res => {
                if (res.success && res.items.length > 0) {
                    this.seminarTimeScheduleList = res.items;
                }
                this.spinner4 = false;
            })
        );
    }

    onChangeResearchProposal($event: any) {
        const seminar = this.seminarTimeScheduleList.find(f => f.m1ResearcherProposalId.id === $event);
        this.presentation.m2CreateSeminarId = seminar.m2CreateSeminarId.id;
        this.selectedProposal = seminar.researcherProposalDto;
    }

    onSubmit() {
        this.saveDisable = true;
        if (this.presentation.id) {
            this.onUpdate()
        } else {
            this.onSave();
        }
    }

    onSave() {
        this.spinner5 = true;
        this.service.create(this.presentation).subscribe (
            response => {
                if (response.success) {
                    this.presentation = response.obj;
                    this.selectedProposal = this.presentation.researcherProposalDto;
                    this.snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.saveDisable = false;
                this.spinner5 = false;
            },
            error => {
                this.saveDisable = false;
                this.spinner5 = false;
            }
        );
    }

    onUpdate() {
        this.spinner6 = true;
        this.service.update(this.presentation).subscribe(
            response => {
                if (response.success) {
                    this.presentation = response.obj;
                    this.selectedProposal = this.presentation.researcherProposalDto;
                    this.snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.saveDisable = false;
                this.spinner6 = false;
            },
            error => {
                this.saveDisable = false;
                this.spinner6 = false;
            }
        );
    }

    startPresentation() {
        this.router.navigate(['start-presentation/' + this.presentation.uuid]);
    }

    previousTab() {
        this.router.navigate(['seminars/']);
    }
}
