import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {EvaluatorsGrantAmountLetter} from "../../../../../models/EvaluatorsGrantAmountLetter";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {EvaluatorsGrantAmount} from "../../../../../models/EvaluatorsGrantAmount";
import {previousIcon, saveIcon} from 'app/main/modules/rpm/constants/button.constants';
import {FuseTranslationLoaderService} from "../../../../../../../core/services/translation-loader.service";
import {SnackbarHelper} from "../../../../../../../core/helper/snackbar.helper";
import {RmsEvaluatorsGrantAmountService} from "../../../../../services/rms-evaluators-grant-amount.service";
import {locale as lngEnglish} from "./i18n/en";
import {locale as lngBangla} from "./i18n/bn";
import {UnsubscribeAdapterComponent} from "../../../../../../../core/helper/unsubscribeAdapter";
import {ExpertEvaluator} from "../../../../../../settings/models/expert-evaluator.model";
import {ExpertEvaluatorService} from "../../../../../../settings/services/expert-evaluator.service";
import {ResearcherProposalService} from "../../../../../services/researcher-proposal.service";
import {ResearcherProposal} from "../../../../../models/ResearcherProposal";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {DEFAULT_PAGE, DEFAULT_SIZE} from "../../../../../../../core/constants/constant";
import {Router} from "@angular/router";

@Component({
    selector: 'app-evaluators-grant-amount',
    templateUrl: './evaluators-grant-amount.component.html',
    styleUrls: ['./evaluators-grant-amount.component.scss']
})
export class EvaluatorsGrantAmountComponent extends UnsubscribeAdapterComponent implements OnInit, OnChanges {


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() existingEvaluatorGrantAmountLetter: EvaluatorsGrantAmountLetter;
    @Input() brodCastChange: BehaviorSubject<any>;
    @Output() backPrevious = new EventEmitter<boolean>();

    spinner = true;
    canSave: boolean;
    update: boolean;
    updatableIndex: number;
    letter: EvaluatorsGrantAmountLetter;
    grantAmount: EvaluatorsGrantAmount = new EvaluatorsGrantAmount();
    grantAmountList: EvaluatorsGrantAmount[] = [];
    deletedGrantAmountList: EvaluatorsGrantAmount[] = [];
    researcherProposals: ({added: boolean; proposal: ResearcherProposal})[] = [];
    evaluatorList: ExpertEvaluator[] = [];
    displayedColumns: string[] = ['sl', 'evaluatorName', 'grantAmount', 'researchTitle', 'action'];
    dataSource: MatTableDataSource<EvaluatorsGrantAmount>;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;

    /*----Button---*/
    saveIcon = saveIcon;
    previousIcon = previousIcon;
    /*----/Button---*/

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: RmsEvaluatorsGrantAmountService,
                private researcherProposalService: ResearcherProposalService,
                private expertEvaluatorService: ExpertEvaluatorService,
                private router: Router,
                private snackbarHelper: SnackbarHelper,) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getEvaluatorList();
        this.spinner = false;
    }

    private getEvaluatorList() {
        this.subscribe$.add(
            this.expertEvaluatorService.getAll().subscribe(res => {
                if (res.success) {
                    this.evaluatorList = res.items ? res.items : [];
                }
            })
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'existingEvaluatorGrantAmountLetter': {
                        if (this.existingEvaluatorGrantAmountLetter?.id) {
                            this.canSave = true;
                            this.letter = this.existingEvaluatorGrantAmountLetter;
                            this.getResearchProposalByFiscalYearId();
                            this.getByRmsEvaluatorsGrantAmountLetterId();
                        }
                        break;
                    }
                    case 'brodCastChange': {
                        this.brodCastChange.subscribe(res => {
                            if (res && res.id) {
                                this.canSave = true;
                                this.letter = res;
                                this.getResearchProposalByFiscalYearId();
                                this.getByRmsEvaluatorsGrantAmountLetterId();
                            }
                        });
                        break;
                    }
                }
            }
        }
    }

    private getResearchProposalByFiscalYearId() {
        this.subscribe$.add(
            this.researcherProposalService.getByFiscalYearId(this.letter.stFiscalYearId).subscribe(res => {
                if (res.success) {
                    this.researcherProposals = res.items ? res.items.map(m => ({proposal: m, added: false})) : [];
                }
            })
        );
    }

    private getByRmsEvaluatorsGrantAmountLetterId() {
        this.subscribe$.add(
            this.service.getByRmsEvaluatorsGrantAmountLetterId(this.letter.id).subscribe(res => {
                if (res.success && res.items?.length > 0) {
                    this.grantAmountList = res.items ? res.items: [];
                    this.dataSource = new MatTableDataSource<EvaluatorsGrantAmount>(this.grantAmountList);
                    this.dataSource.paginator = this.paginator;
                    this.checkedAddedResearchProposal();
                }
            })
        );
    }

    add() {
        this.grantAmount.rmsEvaluatorsGrantAmountLetterId = this.letter.id;
        this.grantAmount.deleted = 0;
        this.grantAmount.researcherProposalDto = this.researcherProposals.find(f => f.proposal.id === this.grantAmount.researcherProposalId).proposal;
        this.grantAmount.evaluator = this.evaluatorList.find(f => f.id === this.grantAmount.stProfileOfExpertEvaluatorsId);
        this.grantAmountList.push(this.grantAmount);
        this.dataSource = new MatTableDataSource<EvaluatorsGrantAmount>(this.grantAmountList);
        this.dataSource.paginator = this.paginator;
        this.grantAmount = new EvaluatorsGrantAmount();
        this.checkedAddedResearchProposal();
        // this.researcherProposals[this.researcherProposals.findIndex(f => f.proposal.id === this.grantAmount.researcherProposalId)].added = true;
    }

    edit(evaluatorsGrantAmount: EvaluatorsGrantAmount, index: number) {
        this.update = true;
        this.updatableIndex = index;
        this.grantAmount = evaluatorsGrantAmount;
    }

    delete(evaluatorsGrantAmount: EvaluatorsGrantAmount, index: number) {
        const deletedData = this.grantAmountList[index];
        if (evaluatorsGrantAmount.uuid) {
            deletedData.deleted = 1;
            this.deletedGrantAmountList.push(deletedData);
        }

        this.grantAmountList.splice(index, 1);
        this.dataSource = new MatTableDataSource<EvaluatorsGrantAmount>(this.grantAmountList);
        this.dataSource.paginator = this.paginator;
        this.grantAmount = new EvaluatorsGrantAmount();
        this.checkedAddedResearchProposal();
    }

    updateData() {
        this.grantAmountList[this.updatableIndex] = this.grantAmount;
        this.dataSource = new MatTableDataSource<EvaluatorsGrantAmount>(this.grantAmountList);
        this.dataSource.paginator = this.paginator;
        this.grantAmount = new EvaluatorsGrantAmount();
        this.checkedAddedResearchProposal();
        this.update = false;
        this.updatableIndex = null;
    }


    private checkedAddedResearchProposal() {
        this.researcherProposals.forEach(e => {
            e.added = this.grantAmountList.some(f => f.researcherProposalId === e.proposal.id && f.deleted === 0);
        });
    }

    onSubmit(exist: boolean) {
        this.spinner = true;
        this.grantAmountList.push(...this.deletedGrantAmountList);
        const list: EvaluatorsGrantAmount[] = this.grantAmountList.map(m => ({...m, rmsEvaluatorsGrantAmountLetterId: this.letter.id}));
        this.subscribe$.add(
            this.service.saveList(list).subscribe(res => {
                if (res.success) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.spinner = false;
                    this.grantAmountList = res.items.map(m => ({...m, isDeleted: 0}));
                    if (exist) {
                        this.router.navigate(['/evaluators-grant-amount-list']);
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                    this.spinner = false;
                }
            })
        );
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        // this.getByRmsEvaluatorsGrantAmountLetterId();
    }

    previousTab(): void {
        this.backPrevious.emit(true);
    }
}
