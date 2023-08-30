import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FuseTranslationLoaderService } from "../../../../../../../core/services/translation-loader.service";
import { locale as lngEnglish } from "./i18n/en";
import { locale as lngBangla } from "./i18n/bn";
import { ResearcherSupervisorInformation } from "../../../../../models/ResearcherSupervisorInformation";
import { UnsubscribeAdapterComponent } from "../../../../../../../core/helper/unsubscribeAdapter";
import { BehaviorSubject } from "rxjs";
import { SnackbarHelper } from "../../../../../../../core/helper/snackbar.helper";
import { ResearcherSupervisorInfoService } from "../../../../../services/researcher-supervisor-info.service";
import { ResearcherProposal } from "../../../../../models/ResearcherProposal";
import { addNewIcon, nextIcon, previousIcon, refreshIcon, saveIcon } from 'app/main/modules/rpm/constants/button.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-researcher-supervisor-info',
    templateUrl: './researcher-supervisor-info.component.html',
    styleUrls: ['./researcher-supervisor-info.component.scss']
})
export class ResearcherSupervisorInfoComponent extends UnsubscribeAdapterComponent implements OnInit, OnChanges {

    @Input() existingProposalInfo: ResearcherProposal;
    @Input() brodCastChange: BehaviorSubject<any>;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() backPrevious = new EventEmitter<boolean>();

    spinner = true;
    supervisorInformation: ResearcherSupervisorInformation = new ResearcherSupervisorInformation();
    canSave: boolean;
    config: { timeOut: 5000; closeButton: true; positionClass: 'toast-top-right'; enableHtml: true; };



    /*----Button---*/
    refreshIcon = refreshIcon;
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    addNewIcon = addNewIcon;
    nextIcon = nextIcon;
    /*----/Button---*/

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private service: ResearcherSupervisorInfoService,
        private snackbarHelper: SnackbarHelper,
        private _toastrService: ToastrService,) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.spinner = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'existingProposalInfo': {
                        if (this.existingProposalInfo.id) {
                            this.canSave = true;
                            this.getByResearcherProposalId(this.existingProposalInfo.id);
                        }
                        break;
                    }
                    case 'brodCastChange': {
                        this.brodCastChange.subscribe(res => {
                            if (res && res.id) {
                                this.canSave = true;
                                this.getByResearcherProposalId(res.id);
                            }
                        });
                        break;
                    }
                }
            }
        }
    }

    getByResearcherProposalId(id: number) {
        this.supervisorInformation.researcherProposalId = id;
        this.subscribe$.add(
            this.service.getByResearcherProposalId(id).subscribe(res => {
                if (res.success) {
                    this.supervisorInformation = res.obj;
                }
            })
        );
    }

    onSubmit(next: boolean) {

        if (!this.supervisorInformation.supervisorName || !this.supervisorInformation.presentOfficeName || !this.supervisorInformation.presentOfficeAddress) {
            this._toastrService.warning("Please enter the required information !.", "", this.config);
            return;
        }

        this.canSave = false;
        if (this.supervisorInformation.id === null || this.supervisorInformation.id === undefined) {
            this.create(next);
        } else {
            this.update(next);
        }

    }

    private create(next: boolean) {
        this.spinner = true;
        this.subscribe$.add(
            this.service.create(this.supervisorInformation).subscribe(res => {
                if (res.success) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.spinner = false;
                    this.canSave = true;
                    this.supervisorInformation = res.obj;
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                    this.canSave = true;
                    this.spinner = false;
                }
            })
        );
    }

    private update(next: boolean) {
        this.spinner = true;
        this.subscribe$.add(
            this.service.update(this.supervisorInformation).subscribe(res => {
                if (res.success) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.spinner = false;
                    this.canSave = true;
                    this.supervisorInformation = res.obj;
                    if (next) {
                        this.nextTab();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                    this.canSave = true;
                    this.spinner = false;
                }
            })
        );
    }

    nextTab() {
        this.nextStep.emit(true);
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }

}
