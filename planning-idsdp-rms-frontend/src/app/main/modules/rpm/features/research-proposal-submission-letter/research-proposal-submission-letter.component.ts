import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ResearcherProposalService} from "../../services/researcher-proposal.service";
import {ResearcherProposalSubmissionLetterService} from "../../services/researcher-proposal-submission-letter.service";
import {ResearcherProposal} from "../../models/ResearcherProposal";
import {ResearcherProposalSubmissionLetter} from "../../models/ResearcherProposalSubmissionLetter";
import {UnsubscribeAdapterComponent} from "../../../../core/helper/unsubscribeAdapter";
import {map, switchMap} from "rxjs/operators";
import {FuseTranslationLoaderService} from "../../../../core/services/translation-loader.service";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {ResearchProfileMultiFormService} from "../../services/research-profile-multi-form.service";
import {previousIcon, saveIcon} from '../../constants/button.constants';
import {UtilsService} from "../../../../core/services/utils.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogConstant} from "../../../../shared/constant/confirm.dialog.constant";
import {SubmitConfirmationDialogComponent} from "../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component";
import {SnackbarHelper} from "../../../../core/helper/snackbar.helper";
import {OK} from "../../../../core/constants/message";
import {MIN_EDITOR_CONFIG} from "../../../../core/constants/editor-config";

@Component({
    selector: 'app-research-proposal-submission-letter',
    templateUrl: './research-proposal-submission-letter.component.html',
    styleUrls: ['./research-proposal-submission-letter.component.scss']
})
export class ResearchProposalSubmissionLetterComponent extends UnsubscribeAdapterComponent implements OnInit {

    uuid: string;
    researcherProposal: ResearcherProposal;
    researcherProfile: any;
    submissionLetter: ResearcherProposalSubmissionLetter = new ResearcherProposalSubmissionLetter();
    spinner = true;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    update: boolean;
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;
    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private activateRoute: ActivatedRoute,
                private router: Router,
                private utilsService: UtilsService,
                private researchProfileMultiFormService: ResearchProfileMultiFormService,
                private service: ResearcherProposalSubmissionLetterService,
                private researcherProposalService: ResearcherProposalService,
                private snackbarHelper: SnackbarHelper,
                private dialog: MatDialog) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.activateRoute.params.subscribe(params => {
            this.uuid = params['uuid'];
        });

        this.getData();
    }

    private getData() {
        this.subscribe$.add(
            this.researcherProposalService.getByUuid(this.uuid).pipe(
                switchMap(proposal => this.service.getByResearcherProposalId(proposal.obj.id).pipe(
                    map(letter => ({proposal: proposal, letter: letter}))
                ))
            ).subscribe(res => {
                this.researcherProposal = res.proposal.obj;
                if (res.letter.success) {
                    this.update = true;
                    this.submissionLetter = res.letter.obj;
                }
                this.spinner = false;
                this.getProfile();
            })
        );
    }

    private getProfile() {
        this.subscribe$.add(
            this.researchProfileMultiFormService.getResearcherProfileById(this.researcherProposal.resProfilePersonalInfoId).subscribe(res => {
                this.researcherProfile = res.obj;
            })
        );
    }

    uploadImageAsBase64(files: any, propertyName: string) {
        // this.utilsService.uploadImageAsBase64(this.form, files, propertyName);
    }

    goToProfile() {
        this.router.navigate(['researcher-profile-information/' + this.researcherProfile.uuid + '/view']);
    }

    goToProposal() {
        this.router.navigate(['researcher-proposal-details/view/' + this.researcherProposal.uuid]);
    }

    previousTab() {
        this.router.navigate(['researcher-profile-information']);
    }

    onSubmit(send: boolean) {
        this.submissionLetter.researcherProposalId = this.researcherProposal.id;
        if (send) {
            this.openDialog(send);
        } else {
            this.submissionLetter.mailSend = 0;
            (this.update) ? this.onUpdate(send) : this.onCreate(send);
        }
    }

    onCreate(send: boolean) {
        this.spinner = true;
        this.service.create(this.submissionLetter).subscribe(
            response => {
                if (response.success) {
                    this.submissionLetter = response.obj;
                    send ? this.snackbarHelper.openSuccessSnackBarWithMessage('Yor profile & proposal information has been sent successfully', OK) :
                        this.snackbarHelper.openSuccessSnackBar();
                }
                this.spinner = false;
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
            }
        );
    }

    onUpdate(send: boolean) {
        this.spinner = true;
        this.service.update(this.submissionLetter).subscribe(
            response => {
                if (response.success) {
                    this.submissionLetter = response.obj;
                    send ? this.snackbarHelper.openSuccessSnackBarWithMessage('Yor profile & proposal information has been sent successfully', OK) :
                        this.snackbarHelper.openSuccessSnackBar();

                }
                this.spinner = false;
            },
            error => {
                console.log('error ==== >>>> ', error);
                this.spinner = false;
            }
        );
    }

    private openDialog(send: boolean) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: 'Are you sure you want to send this proposal?'};
        const dialogRef = this.dialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.submissionLetter.mailSend = 1;
                (this.update) ? this.onUpdate(send) : this.onCreate(send);
            }
            dialogRef.close(true);
        });
    }
}
