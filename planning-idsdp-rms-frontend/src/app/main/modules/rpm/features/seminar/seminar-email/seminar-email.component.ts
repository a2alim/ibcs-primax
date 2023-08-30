import {Component, OnInit} from '@angular/core';
import {FuseTranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {FiscalYearServiceService} from "../../../../settings/services/fiscal-year-service.service";
import {ToastrService} from "ngx-toastr";
import {ResearcherProposalService} from "../../../services/researcher-proposal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LatterService} from "../../../services/latter.service";
import {locale as lngEnglish} from "../i18n/en";
import {locale as lngBangla} from "../i18n/bn";
import {downloadIcon, noteIcon, previousIcon, printIcon, saveIcon, sendItem} from '../../../constants/button.constants';
import {CommitteeTypeService} from "../../../../settings/services/committee-type.service";
import {MatSelectChange} from "@angular/material/select";
import {SeminarEmailModel} from "../../../models/SeminarEmailModel";
import {UserService} from "../../../../../core/user/user.service";
import {CommitteeMemberService} from "../../../../settings/services/committee-member.service";
import {EmailService} from "../../../../../shared/services/email.service";
import {EmailModel} from "../../../../../shared/model/email.model";
import {MIN_EDITOR_CONFIG} from "../../../../../core/constants/editor-config";

@Component({
    selector: 'app-seminar-email',
    templateUrl: './seminar-email.component.html',
    styleUrls: ['./seminar-email.component.scss']
})
export class SeminarEmailComponent implements OnInit {

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    sendItem = sendItem;
    noteIcon = noteIcon;
    saveIcon = saveIcon;

    /*----/Button---*/
    commiteeTypeList: any[] = [];
    researchTitleNames: any[] = [];
    seminarEmailModel: SeminarEmailModel = new SeminarEmailModel();
    emailModel: EmailModel = new EmailModel();

    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };

    isEditable: boolean = false;
    seminerId: string;
    fiscalYearId: number;
    formGroup: any;

    emptyField: any = 'sdfsdf'
    emails = '';

    researcherProposalList: any[] = new Array();
    mediumEditorConfig: any = MIN_EDITOR_CONFIG;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private fiscalyearservice: FiscalYearServiceService,
                private _toastrService: ToastrService,
                private _researcherProposalService: ResearcherProposalService,
                private _router: Router,
                private _userService: UserService,
                private _emailService: EmailService,
                private _committeeTypeService: CommitteeTypeService,
                private _committeeMemberService: CommitteeMemberService,
                private _activatedRoute: ActivatedRoute,
                private _latterService: LatterService) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);

        this.seminerId = String(this._activatedRoute.snapshot.paramMap.get('id'));

        this.getCommitteeTypeList();
    }

    ngOnInit(): void {

    }


    sandMail() {
        this.emailModel = {
            body: this.seminarEmailModel.mailBody,
            isAttachment: false,
            subject: this.seminarEmailModel.subject,
            templateName: "default-email-template",
            to: this.seminarEmailModel.to

        };
        this._emailService.sentEmail(this.emailModel).subscribe(response => {
            this.updateStatus();
        });
    }


    private updateStatus() {
        this.seminarEmailModel.seminarId = this.seminerId;
        this._latterService.saveEmailData(this.seminarEmailModel).subscribe(data => {
            if (data.success) {
                this._router.navigate(['/seminars/'])
                this._toastrService.success(data.message, "Mail Sent!", this.config);
            } else {
                this._toastrService.error(data.message, "Error!", this.config);
            }
        }, error => {
            this._toastrService.error('Something went wrong!', "Error!", this.config);
        })
    }

    getCommitteeTypeList() {
        this._committeeTypeService.getAllActiveList().subscribe(
            res => {
                this.commiteeTypeList = res.items ? res.items : [];
            }
        );
    }


    back() {
        this._router.navigate(['letter']);
    }

    setEmailInToBox($event: MatSelectChange) {
        this.getListData($event.value);

    }

    getListData(id: any) {
        this.emails = '';
        this._committeeMemberService.getAllActiveList().subscribe(res => {
            res.forEach(item => {
                if (item.stCommitteeTypeId === id) {
                    this.emails = this.emails + item.createdBy + ',';
                }
            })
            this.seminarEmailModel.to = this.emails;
        })
    }
}
