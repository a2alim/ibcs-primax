import {Component, OnInit} from '@angular/core';
import {UnsubscribeAdapterComponent} from "../../../../../../core/helper/unsubscribeAdapter";
import {ResearcherPresentation} from "../../../../models/ResearcherPresentation";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {ResearcherPresentationService} from "../../../../services/researcher-presentation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {addNewIcon, editIcon, saveIcon} from '../../../../constants/button.constants';
import {PresentationEvaluatorsFeedbackService} from "../../../../services/presentation-evaluators-feedback.service";
import {NewMemberService} from "../../../../services/new-member.service";
import {NewMember} from "../../../../models/NewMember";
import {ViewPresentationEvaluatorsFeedback} from "../../../../models/ViewPresentationEvaluatorsFeedback";
import {PresentationEvaluatorsFeedback} from "../../../../models/PresentationEvaluatorsFeedback";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {ERROR, OK} from "../../../../../../core/constants/message";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NewMemberAddModalComponent} from "../new-member-add-modal/new-member-add-modal.component";
import {EvaluatorNewmemberAttendanceService} from "../../../../services/evaluator-newmember-attendance.service";
import {EvaluatorNewMemberAttendance} from "../../../../models/EvaluatorNewMemberAttendance";

@Component({
    selector: 'app-start-presentation',
    templateUrl: './start-presentation.component.html',
    styleUrls: ['./start-presentation.component.scss']
})

export class StartPresentationComponent extends UnsubscribeAdapterComponent implements OnInit {

    spinner = true;
    presentationUuid: string;
    presentation: ResearcherPresentation;
    // presentationEvaluatorsFeedbackList: PresentationEvaluatorsFeedback[] = [];
    // presentationNewMemberFeedbackList: PresentationEvaluatorsFeedback[] = [];
    evaluatorsAttendanceList: EvaluatorNewMemberAttendance[] = [];
    newMemberAttendanceList: EvaluatorNewMemberAttendance[] = [];
    // evaluatorNewMemberAttendances: EvaluatorNewMemberAttendance[] = [];
    evaluatorList: ({ attendanceId: number, attendanceUuid: string, present: boolean } & ViewPresentationEvaluatorsFeedback)[] = [];
    newMemberList: ({ attendanceId: number, attendanceUuid: string, present: boolean } & NewMember)[] = [];
    saveDisable: boolean;
    saveIcon = saveIcon;
    editIcon = editIcon;
    addNewIcon = addNewIcon;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: PresentationEvaluatorsFeedbackService,
                private newMemberService: NewMemberService,
                private researcherPresentationService: ResearcherPresentationService,
                private evaluatorNewmemberAttendanceService: EvaluatorNewmemberAttendanceService,
                private dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private snackbarHelper: SnackbarHelper) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.presentationUuid = params['presentationUuid'];
            this.getResearchPresentationByUuid();
        });
    }

    private getResearchPresentationByUuid() {
        this.spinner = true;
        this.subscribe$.add(
            this.researcherPresentationService.getByUuid(this.presentationUuid).subscribe(res => {
                if (res.success && res.obj) {
                    this.presentation = res.obj;
                    // this.getByEvaluatorsFeedbackResearcherPresentationId(true);
                    this.getByAttendanceResearcherPresentationId(true);
                }
                this.spinner = false;
            })
        );
    }

    private getByAttendanceResearcherPresentationId(callOthers: boolean) {
        this.spinner = true;
        this.subscribe$.add(
            this.evaluatorNewmemberAttendanceService.getByResearcherPresentationId(this.presentation.id).subscribe(res => {
                if (res.success && res.items?.length > 0) {
                    this.evaluatorsAttendanceList = res.items.filter(f => f.stProfileOfExpertEvaluatorsId);
                    this.newMemberAttendanceList = res.items.filter(f => f.m2AddNewMemberId);
                    // if (res.items.some(s => s.stProfileOfExpertEvaluatorsId)) {
                    //     res.items.filter(f => f.stProfileOfExpertEvaluatorsId).forEach(e => {
                    //         const found = this.presentationEvaluatorsFeedbackList.some(s => s.stProfileOfExpertEvaluatorsId === e.stProfileOfExpertEvaluatorsId);
                    //         if (found) {
                    //             const data = this.presentationEvaluatorsFeedbackList.find(f => f.stProfileOfExpertEvaluatorsId === e.stProfileOfExpertEvaluatorsId);
                    //             this.evaluatorList.push({attendanceId: e.id, attendanceUuid: e.uuid, present: e.isPresent, ...e});
                    //         } else {
                    //             this.evaluatorList.push({attendanceId: null, attendanceUuid: null, present: false, ...e});
                    //         }
                    //     });
                    //
                    // }
                    // if (res.items.some(s => s.m2AddNewMemberId)) {
                    //
                    // }
                } else this.spinner = false;
                if (callOthers) {
                    this.getEvaluatorBySeminarId();
                    this.getNewMembersByResearcherPresentationId();
                }
            })
        );
    }

    private getEvaluatorBySeminarId() {
        this.spinner = true;
        this.subscribe$.add(
            this.service.findEvaluatorBySeminarId(this.presentation.m2CreateSeminarId).subscribe(res => {
                if (res.success && res.items) {
                    if (this.evaluatorsAttendanceList.length > 0) {
                        res.items.forEach(e => {
                            const found = this.evaluatorsAttendanceList.some(s => s.stProfileOfExpertEvaluatorsId === e.stProfileOfExpertEvaluatorsId);
                            if (found) {
                                const data = this.evaluatorsAttendanceList.find(f => f.stProfileOfExpertEvaluatorsId === e.stProfileOfExpertEvaluatorsId);
                                this.evaluatorList.push({
                                    attendanceId: data.id,
                                    attendanceUuid: data.uuid,
                                    present: data.isPresent, ...e
                                });
                            } else {
                                this.evaluatorList.push({
                                    attendanceId: null,
                                    attendanceUuid: null,
                                    present: false, ...e
                                });
                            }
                        });
                        this.spinner = false;
                    } else {
                        this.evaluatorList = res.items.map(m => ({
                            ...m,
                            attendanceId: null,
                            attendanceUuid: null,
                            present: false
                        }));
                        this.spinner = false;
                    }
                    /*if (this.presentationEvaluatorsFeedbackList.length > 0) {
                        res.items.forEach(e => {
                            const found = this.presentationEvaluatorsFeedbackList.some(s => s.stProfileOfExpertEvaluatorsId === e.stProfileOfExpertEvaluatorsId);
                            if (found) {
                                const data = this.presentationEvaluatorsFeedbackList.find(f => f.stProfileOfExpertEvaluatorsId === e.stProfileOfExpertEvaluatorsId);
                                this.evaluatorList.push({feedbackId: data.id, feedbackUuid: data.uuid, present: data.isPresent, ...e});
                            } else {
                                this.evaluatorList.push({feedbackId: null, feedbackUuid: null, present: false, ...e});
                            }
                        });
                    } else {
                        this.evaluatorList = res.items.map(m => ({
                            ...m,
                            feedbackUuid: null,
                            feedbackId: null,
                            present: false
                        }));
                    }*/
                } else this.spinner = false;
            })
        );
    }

    private getNewMembersByResearcherPresentationId() {
        this.spinner = true;
        this.subscribe$.add(
            this.newMemberService.findAllByResearcherPresentationId(this.presentation.id).subscribe(res => {
                if (res.success && res.items) {
                    if (this.newMemberAttendanceList.length > 0) {
                        res.items.forEach(e => {
                            const found = this.newMemberAttendanceList.some(s => s.m2AddNewMemberId === e.id);
                            if (found) {
                                const data = this.newMemberAttendanceList.find(f => f.m2AddNewMemberId === e.id);
                                this.newMemberList.push({
                                    attendanceId: data.id,
                                    attendanceUuid: data.uuid,
                                    present: data.isPresent, ...e
                                });
                            } else {
                                this.newMemberList.push({
                                    attendanceId: null,
                                    attendanceUuid: null,
                                    present: false, ...e
                                });
                            }
                        });
                        this.spinner = false;
                    } else {
                        this.newMemberList = res.items.map(m => ({
                            ...m,
                            attendanceId: null,
                            attendanceUuid: null,
                            present: false
                        }));
                        this.spinner = false;
                    }
                    /*if (this.presentationNewMemberFeedbackList.length > 0) {
                        res.items.forEach(e => {
                            const found = this.presentationNewMemberFeedbackList.some(s => s.m2AddNewMemberId === e.id);
                            if (found) {
                                const data = this.presentationNewMemberFeedbackList.find(f => f.m2AddNewMemberId === e.id);
                                this.newMemberList.push({feedbackId: data.id, feedbackUuid: data.uuid, present: data.isPresent, ...e});
                            } else {
                                this.newMemberList.push({feedbackId: null, feedbackUuid: null, present: false, ...e});
                            }
                        });
                    } else {
                        this.newMemberList = res.items.map(m => ({
                            ...m,
                            feedbackUuid: null,
                            feedbackId: null,
                            present: false
                        }));
                    }*/
                } else this.spinner = false;
            })
        );
    }

    onChangeNewMemberAttendance($event: MatCheckboxChange, e: ({ attendanceId: number; attendanceUuid: string; present: boolean } & NewMember), index: number) {
        this.spinner = true;
        const data: EvaluatorNewMemberAttendance = {} as EvaluatorNewMemberAttendance;
        data.isPresent = $event.checked;
        data.m2AddNewMemberId = e.id;
        data.m1ResearcherProposalId = this.presentation.m1ResearcherProposalId;
        data.m2ResearcherPresentationId = this.presentation.id;
        if (e.attendanceUuid) {
            data.id = e.attendanceId;
            data.uuid = e.attendanceUuid;
            this.onUpdate(data);
        } else {
            this.onSave(data, index, true);
        }
    }

    onChangeEvaluatorAttendance($event: MatCheckboxChange, e: ({ attendanceId: number; attendanceUuid: string; present: boolean } & ViewPresentationEvaluatorsFeedback), index: number) {
        this.spinner = true;
        const data: EvaluatorNewMemberAttendance = {} as EvaluatorNewMemberAttendance;
        data.isPresent = $event.checked;
        data.stProfileOfExpertEvaluatorsId = e.stProfileOfExpertEvaluatorsId;
        data.m1ResearcherProposalId = this.presentation.m1ResearcherProposalId;
        data.m2ResearcherPresentationId = this.presentation.id;
        // data.isNew = true;
        if (e.attendanceUuid) {
            data.id = e.attendanceId;
            data.uuid = e.attendanceUuid;
            this.onUpdate(data);
        } else {
            this.onSave(data, index, false);
        }
    }

    onSave(data: EvaluatorNewMemberAttendance, index: number, newMember: boolean) {
        this.spinner = true;
        this.evaluatorNewmemberAttendanceService.create(data).subscribe(response => {
                if (response.success) {
                    if (newMember) {
                        this.newMemberList[index].attendanceId = response.obj.id;
                        this.newMemberList[index].attendanceUuid = response.obj.uuid;
                    } else {
                        this.evaluatorList[index].attendanceId = response.obj.id;
                        this.evaluatorList[index].attendanceUuid = response.obj.uuid;
                    }
                    this.getByAttendanceResearcherPresentationId(false);
                    this.snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.saveDisable = false;
                this.spinner = false;
            },
            _ => {
                this.saveDisable = false;
                this.spinner = false;
            }
        );
    }

    onUpdate(data: EvaluatorNewMemberAttendance) {
        this.spinner = true;
        this.evaluatorNewmemberAttendanceService.update(data).subscribe(response => {
                if (response.success) {
                    this.getByAttendanceResearcherPresentationId(false);
                    this.snackbarHelper.openSuccessSnackBarWithMessage(response.message, OK);
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(response.message, ERROR);
                }
                this.saveDisable = false;
                this.spinner = false;
            },
            _ => {
                this.saveDisable = false;
                this.spinner = false;
            }
        );
    }

    addEditNewMember(edit: boolean, newMember: NewMember) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '70%';
        dialogConfig.height = 'auto';
        dialogConfig.data = {presentation: this.presentation, newMember: newMember, edit: edit};

        const dialogRef = this.dialog.open(NewMemberAddModalComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                this.getNewMembersByResearcherPresentationId();
                dialogRef.close(true);
            }
        });
    }

    evaluatorFeedBack(feedbackUuid: string) {
        this.router.navigate(['evaluator-feedback/' + feedbackUuid]);
    }


    /*private getByEvaluatorsFeedbackResearcherPresentationId(callOthers: boolean) {
        this.spinner = true;
        this.subscribe$.add(
            this.service.getByResearcherPresentationId(this.presentation.id).subscribe(res => {
                if (res.success && res.items) {
                    if (res.items.some(s => s.stProfileOfExpertEvaluatorsId)) {
                        this.presentationEvaluatorsFeedbackList = res.items.filter(f => f.stProfileOfExpertEvaluatorsId);
                    }
                    if (res.items.some(s => s.m2AddNewMemberId)) {
                        this.presentationNewMemberFeedbackList = res.items.filter(f => f.m2AddNewMemberId);
                    }
                }
                if (callOthers) {
                    this.getByAttendanceResearcherPresentationId();
                    // this.getEvaluatorBySeminarId();
                    // this.getNewMembersByResearcherPresentationId();
                }
                this.spinner = false;
            })
        );
    }*/
}
