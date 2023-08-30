import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { SnackbarHelper } from "../../../../../core/helper/snackbar.helper";
import { UnsubscribeAdapterComponent } from "../../../../../core/helper/unsubscribeAdapter";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { addComment, downloadIcon, previousIcon, printIcon, saveIcon } from '../../../constants/button.constants';
import { EvaluationFieldType } from "../../../contants/different-type.constant";
import { ResearcherProposal } from "../../../models/ResearcherProposal";
import { ResearcherProposalMarks } from "../../../models/ResearcherProposalMarks";
import { ResearcherProposalMarksService } from "../../../services/researcher-proposal-marks.service";
import { ResearcherProposalService } from "../../../services/researcher-proposal.service";
import { locale as lngBangla } from "./i18n/bn";
import { locale as lngEnglish } from "./i18n/en";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../../shared/constant/confirm.dialog.constant";
import {
    SubmitConfirmationDialogComponent
} from "../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";

@Component({
    selector: 'app-researcher-proposal-marks',
    templateUrl: './researcher-proposal-marks.component.html',
    styleUrls: ['./researcher-proposal-marks.component.scss']
})
export class ResearcherProposalMarksComponent extends UnsubscribeAdapterComponent implements OnInit {

    spinner = true;
    saveDisable: boolean = false;
    proposalUuid: string;
    proposal: ResearcherProposal;
    marks: ({ evaluationField: any; mark: ResearcherProposalMarks })[] = [];
    saveIcon = saveIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    previousIcon = previousIcon;
    addComment = addComment;
    total: number;
    loginUserInfo: any;
    allreadySaved: Boolean = false;
    langVal:string;
    isDraft: boolean = true;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private service: ResearcherProposalMarksService,
        private researcherProposalService: ResearcherProposalService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private snackbarHelper: SnackbarHelper,
        private storageService: StorageService,
        private dataCom: DataComService, private dialog: MatDialog,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.langVal = localStorage.getItem("currentLang")
        this.dataCom.getPassedItemData.subscribe(res => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });
    }

    ngOnInit(): void {
        this.loginUserInfo = this.storageService.getUserData();
        this.activatedRoute.params.subscribe(params => {
            this.proposalUuid = params['proposalUuid'];
            this.getResearchProposal();
        });
    }

    private getResearchProposal() {
        this.subscribe$.add(
            this.researcherProposalService.getByUuid(this.proposalUuid).subscribe(res => {
                if (res.success) {
                    this.proposal = res.obj;
                    this.getByResearcherProposalId();
                } else {
                    this.spinner = false;
                }
            })
        );
    }

    private getByResearcherProposalId() {
        this.subscribe$.add(
            this.service.getByResearcherProposalId(this.proposal.id).subscribe(res => {
                if (res.success && res.items?.length > 0) {
                    this.allreadySaved = true;
                    this.setSavedMarks(res.items);
                    this.checkIsDraft(res.items);
                    // this.marks = res.items
                    //     .map(m => ({
                    //         evaluationField: EvaluationFieldType.find(f => f.value == m.evaluationFieldType),
                    //         mark: m
                    //     }))
                    //     .sort((a, b) => (a.evaluationField.sort > b.evaluationField.sort) ? 1 : -1);
                } else {
                    this.setMarks();
                    this.setTotal();
                }
                this.spinner = false;
            })
        );
    }

    checkIsDraft(items) {
        items.forEach(f => {
            if (f.isDraft || f.isDraft == null) {
                this.isDraft = true;
            } else {
                this.isDraft = false;
                return;
            }
        })
        console.log(this.isDraft)
    }

    private setSavedMarks(marks: ResearcherProposalMarks[]) {
        EvaluationFieldType.forEach(e => {
            if (marks.some(f => f.evaluationFieldType === e.value)) {
                this.marks.push(
                    {
                        evaluationField: e,
                        mark: marks.find(f => f.evaluationFieldType === e.value),
                    }
                );
            } else {
                this.marks.push(
                    {
                        evaluationField: e,
                        mark: this.getMark(e),
                    }
                );
            }
            this.setTotal();
        });
    }

    private setMarks() {
        EvaluationFieldType.forEach(e => {
            this.marks.push(
                {
                    evaluationField: e,
                    mark: this.getMark(e)
                }
            )
        });
    }

    private getMark(e: { nameBn: string; nameEn: string; sort: number; value: string }) {
        return {
            id: null,
            uuid: null,
            researcherProposalId: this.proposal.id,
            evaluationFieldType: e.value,
            markOne: 0,
            markTwo: 0,
            markThree: 0,
            markFour: 0,
            markFive: 0,
            markSix: 0,
            markSeven: 0,
            markEight: 0,
            markNine: 0,
            markTen: 0,
            totalMarks: 0,
            comments:'',
            isDraft: true
        };
    }

    openDialog(type: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.SEND };
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {

                this.onSubmit(type);

            }
            dialogRef.close(true);
        });
    }

    onSubmit(type: string) {
        console.log('this.marks',  this.marks);
        //return 0;

        this.marks.forEach(f => {
            type == "draft" ? f.mark.isDraft = true : f.mark.isDraft = false;
        })

        this.spinner = true;
        this.saveDisable = true;

        this.subscribe$.add(
            this.service.saveList(this.marks.map(m => m.mark)).subscribe(res => {
                if (res.success) {
                    type == 'draft' ? this.snackbarHelper.openSuccessSnackBar() : this.snackbarHelper.openSuccessSendSnackBar();
                    this.checkIsDraft(this.marks.map(m => m.mark));
                    this.spinner = false;
                    this.saveDisable = false;
                    this.allreadySaved = true;
                    this.marks = res.items
                        .map(m => ({
                            evaluationField: EvaluationFieldType.find(f => f.value == m.evaluationFieldType),
                            mark: m
                        }))
                        .sort((a, b) => (a.evaluationField.sort > b.evaluationField.sort) ? 1 : -1);

                } else {
                    this.snackbarHelper.openErrorSnackBar();
                    this.spinner = false;
                    this.saveDisable = false;
                }
            })
        );
    }

    onValueChange($event: KeyboardEvent, field: string, index: number) {
        if (!$event.target['value']) {
            this.marks[index].mark[field] = 0;
        }
        this.marks[index].mark.totalMarks = this.marks[index].mark.markOne + this.marks[index].mark.markTwo + this.marks[index].mark.markThree +
            this.marks[index].mark.markFour + this.marks[index].mark.markFive + this.marks[index].mark.markSix + this.marks[index].mark.markSeven +
            this.marks[index].mark.markEight + this.marks[index].mark.markNine + this.marks[index].mark.markTen;
        this.setTotal();
    }

    private setTotal() {
        this.total = this.marks.map(m => m.mark.totalMarks).reduce((sum, current) => (sum + current), 0);
    }

    previousTab() {
        this.router.navigate(['/researcher/list']);
    }

}
