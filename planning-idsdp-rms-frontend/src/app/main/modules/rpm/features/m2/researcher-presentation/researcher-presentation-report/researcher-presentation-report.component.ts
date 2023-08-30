import {Component, OnInit} from '@angular/core';
import {UnsubscribeAdapterComponent} from "../../../../../../core/helper/unsubscribeAdapter";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {ActivatedRoute} from "@angular/router";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {PresentationEvaluatorsFeedbackService} from "../../../../services/presentation-evaluators-feedback.service";
import {PresentationEvaluatorsFeedback} from "../../../../models/PresentationEvaluatorsFeedback";
import {EMPTY_EDITOR_CONFIG} from "../../../../../../core/constants/editor-config";
import {ResearcherProposal} from "../../../../models/ResearcherProposal";
import {ResearcherProfilePersonalInfo} from "../../../../models/ResearcherProfilePersonalInfo";

@Component({
    selector: 'app-researcher-presentation-report',
    templateUrl: './researcher-presentation-report.component.html',
    styleUrls: ['./researcher-presentation-report.component.scss'],
})
export class ResearcherPresentationReportComponent extends UnsubscribeAdapterComponent implements OnInit {

    spinner = true;
    seminarUuid: string;
    presentationReport: PresentationEvaluatorsFeedback;
    editor = EMPTY_EDITOR_CONFIG;
    data: { sl: number, rowSpan: number; proposal: ResearcherProposal, profile: ResearcherProfilePersonalInfo, report: PresentationEvaluatorsFeedback }[] = [];

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: PresentationEvaluatorsFeedbackService,
                private activatedRoute: ActivatedRoute,) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.seminarUuid = params['seminarUuid'];
            this.getPresentationReport();
        });
    }

    private getPresentationReport() {
        this.subscribe$.add(
            this.service.findSeminarPresentationReport(this.seminarUuid).subscribe(res => {
                if (res.success && res.obj) {
                    this.presentationReport = res.obj;
                    this.arrangeData(res.obj.presentationEvaluatorsFeedbackList)
                } else {
                    this.spinner = false;
                }
            })
        );
    }

    private arrangeData(data: PresentationEvaluatorsFeedback[]) {
        let group = data.reduce((r, a) => {
            r[a.m1ResearcherProposalId] = [...r[a.m1ResearcherProposalId] || [], a];
            return r;
        }, {});
        Object.keys(group).forEach((key, index) => {
            const feedback: PresentationEvaluatorsFeedback[] = group[key];
            feedback.forEach((e, i) => {
                if (i === 0) {
                    // let pro = e.researcherProposalResponseDto.researcherProfilePersonalInfoMaster;
                    // pro.designation = (e.researcherProposalResponseDto.researcherProfilePersonalInfoMaster.designation !== null) ? e.researcherProposalResponseDto.researcherProfilePersonalInfoMaster.designation : '';
                    // pro.detailsPresentAddress = (e.researcherProposalResponseDto.researcherProfilePersonalInfoMaster.detailsPresentAddress !== null) ? e.researcherProposalResponseDto.researcherProfilePersonalInfoMaster.detailsPresentAddress : '';

                    this.data.push({
                        sl: index + 1,
                        rowSpan: feedback.length,
                        proposal: e.researcherProposal,
                        profile: e.researcherProposal.researcherProfilePersonalInfoMaster,
                        report: e
                    });
                } else {
                    this.data.push({sl: null, rowSpan: 0, proposal: null, profile: null, report: e});
                }
            });
            console.log(this.data);
        });
        this.spinner = false;
    }
    
}
