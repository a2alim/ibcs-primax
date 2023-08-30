import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UnsubscribeAdapterComponent} from "../../../../../../core/helper/unsubscribeAdapter";
import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from "../../../../../../core/constants/editor-config";
import {DEFAULT_PAGE} from "../../../../../../core/constants/constant";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IProjectConcept} from "../../../../../project-concept-management/models/project-concept";
import {SectorDivisionModel} from "../../../../../configuration-management/models/sector-division.model";
import {SectorModel} from "../../../../../configuration-management/models/sector.model";
import {SubSectorModel} from "../../../../../configuration-management/models/sub-sector.model";
import {IMainCofog} from "../../../../../configuration-management/models/main-cofog";
import {IOptionalCofog} from "../../../../../configuration-management/models/optional-cofog";
import {IDetailsCofog} from "../../../../../configuration-management/models/details-cofog";
import {CategoryEnvironmentModel} from "../../../../../configuration-management/models/categoryEnvironmentModel.model";
import {ProjectType} from "../../../../../configuration-management/models/project-type.model";
import {IPriorityModel} from "../../../../../configuration-management/models/priority.model";
import {FuseTranslationLoaderService} from "../../../../../../core/services/translation-loader.service";
import {ProjectSummaryService} from "../../../../../project-concept-management/services/project-summary.service";
import {ProjectTypeService} from "../../../../../configuration-management/services/project-type.service";
import {PriorityService} from "../../../../../configuration-management/services/priority.service";
import {SectorDivisionService} from "../../../../../configuration-management/services/sector-division.service";
import {SectorService} from "../../../../../configuration-management/services/sector.service";
import {SubSectorService} from "../../../../../configuration-management/services/sub-sector.service";
import {MainCofogService} from "../../../../../configuration-management/services/main-cofog.service";
import {OptionalCofogService} from "../../../../../configuration-management/services/optional-cofog.service";
import {DetailsCofogService} from "../../../../../configuration-management/services/details-cofog.service";
import {CategoryEnvironmentService} from "../../../../../configuration-management/services/category-environment.service";
import {FileUploadService} from "../../../../../../core/services/file-upload.service";
import {Router} from "@angular/router";
import {ProjectConceptService} from "../../../../../project-concept-management/services/project-concept.service";
import {SnackbarHelper} from "../../../../../../core/helper/snackbar.helper";
import {ModeOfFinanceService} from "../../../../../project-concept-management/services/mode-of-finance.service";
import {LocationHelperService} from "../../../../../../shared/services/location-helper.service";
import {UtilsService} from "../../../../../../core/services/utils.service";
import {UserGroupService} from "../../../../../configuration-management/services/user-group.service";
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {map, switchMap} from "rxjs/operators";
import {MatSelectChange} from "@angular/material/select";
import {ERROR, FAILED_UPDATE} from "../../../../../../core/constants/message";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";



@Component({
  selector: 'app-create-new-feasibility-study',
  templateUrl: './create-new-feasibility-study.component.html',
  styleUrls: ['./create-new-feasibility-study.component.scss']
})
export class CreateNewFeasibilityStudyComponent extends UnsubscribeAdapterComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;


    @Input() id: number;
    @Input() canEdit: boolean;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() projectConceptMasterId = new EventEmitter<number>();

    page: number = DEFAULT_PAGE;
    form: FormGroup;
    formGroup: FormGroup;
    updateForm: FormGroup;
    updateSummaryForm: FormGroup;
    summaryForm: FormGroup;
    projectSummary: IProjectConcept;
    sectorsDivisions: SectorDivisionModel[] = [];
    sectors: SectorModel[] = [];
    subSectors: SubSectorModel[] = [];
    mains: IMainCofog[] = [];
    optionals: IOptionalCofog[] = [];
    details: IDetailsCofog[] = [];
    category: CategoryEnvironmentModel[] = [];
    projectTypeList: ProjectType[] = [];
    priorityList: IPriorityModel[] = [];

    projectTitleList: IProjectConcept[] = [];
    canUpdate: boolean = false;

    expCommencementMaxDate: Date;
    expCompletionMinDate: Date;


    show = true;

    userId: any;
    ministry_name: string;
    agency_name: string;
    file;
    File;
    isAttachmentEnable: boolean;
    dppSave : boolean = true;
    dppSaveAndPcUpdate: boolean = false;

    isFeasibilityStudyReport : boolean = false;

    spinner: boolean;

    constructor(private fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: ProjectSummaryService,
                private projectTypeService: ProjectTypeService,
                private priorityService: PriorityService,
                private sectorDivisionService: SectorDivisionService,
                private sectorService: SectorService,
                private subSectorService: SubSectorService,
                private mainCofogService: MainCofogService,
                private optionalCofogService: OptionalCofogService,
                private detailsCofogService: DetailsCofogService,
                private categoryEnvironmentService: CategoryEnvironmentService,
                private fileUploadService: FileUploadService,
                private router: Router,
                private projectConceptService: ProjectConceptService,
                private snackbarHelper: SnackbarHelper,
                private modeOfFinanceService: ModeOfFinanceService,
                private locationHelperService: LocationHelperService,
                private utilsService: UtilsService,
                private userGroupService: UserGroupService
    ) {
        super();
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        if (this.id > 0) {
            this.canUpdate = true;
        }
        this.getAllApi();
        this.getUserGroup();
    }

    getUserGroup() {
        this.userGroupService.getUserGroup().subscribe(res => {
            this.userId = res.res.userId;
            this.getUserInfoByUserId(this.userId);
        })
    }

    getUserInfoByUserId(userId) {
        this.userGroupService.geUserInfoByUserId(userId).subscribe(res => {
            this.agency_name = res.agency.nameEn;
            this.ministry_name = res.agency.ministryDivision.nameEn;
        })
    }



    /**
     * calling sector division, sector and main cofog api
     * @private
     */
    private getAllApi() {
        this.subscribe$.add(
            this.sectorDivisionService.getActiveSectorDivision().pipe(
                // switchMap(sectorDivisions => this.sectorService.getActiveSector().pipe(
                switchMap(sectorDivisions => this.mainCofogService.getActiveMainCofog().pipe(
                    switchMap(mains => this.categoryEnvironmentService.getAllActiveCategoryEnvironmentList().pipe(
                        switchMap(cat => this.projectTypeService.getActiveProjectType().pipe(
                            switchMap(pType => this.priorityService.getActivePriority().pipe(
                                map(priority => ({
                                    sectorDivisions: sectorDivisions,
                                    // sectors: sectors,
                                    mains: mains,
                                    cat: cat,
                                    pType: pType,
                                    priority: priority
                                }))
                                // ))
                            ))
                        ))
                    ))
                ))
            ).subscribe(res => {
                this.sectorsDivisions = res.sectorDivisions;
                // this.sectors = res.sectors;
                this.mains = res.mains.content;
                this.category = res.cat;
                this.projectTypeList = res.pType;
                this.priorityList = res.priority;
                this.getAllProjectTitle()
                this.getApproveProjectConceptList();
                if (this.canUpdate) {

                    this.getProjectSummaryById();
                } else this.populateForm();
            })
        );
    }

    getAllProjectTitle() {
        this.service.getList().subscribe((res) => {
            this.projectTitleList = res.filter(e => e.sourceModuleType === 'PC');
            this.updatePopulateForm();
        })
    }

    getApproveProjectConceptList(){
        this.service.getApproveProjectConceptList().subscribe(res => {
            res.res.forEach(r =>{

            })
        })
    }


    onChangeProjectTitle($event: MatSelectChange) {
        this.service.getById($event.value).subscribe((res) => {
            this.dppSave = false;
            this.dppSaveAndPcUpdate = true;
            this.projectSummary = res;
            this.setValue(res);
            this.updatePopulateForm();
        })
    }

    /**
     * calling project Summary
     * @private
     */
    private getProjectSummaryById() {
        this.subscribe$.add(
            this.service.getById(this.id).subscribe(res => {
                this.projectSummary = res;
                this.onchangeMain(res.mainCofogId);
                this.onchangeOptional(res.optionalCofogId);
                this.onchangeSectorDivision(res.sectorDivisionId);
                this.onchangeSector(res.sectorId);
                this.populateWithSettingFormPatchValue();
            })
        );
    }

    /**
     * Validation add during Project Type Change
     * @param value
     */
    onChangeProjectType(value: any): void {
        if (value) {
            if ((this.projectTypeList.find(f => f.id === value).nameEn === 'DPP') && (Number(this.form.value.total) >= 500000000)) {
                this.form.patchValue({feasibilityStudy: 'Yes'});
            }
            this.form.patchValue({
                projectType: this.form.value.projectType.id
            });
        }
    }


    /**
     * set total value on changing own fund
     * @param $event
     */
    onOwnFundChange($event: FocusEvent) {
        const of = ($event.target['value']) ? Number($event.target['value']) : 0;
        if (this.form.value.feOwnFundAmount > of) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", ERROR);
            this.form.patchValue({feOwnFundAmount: 0});
        }
        this.form.patchValue({
            totalAmount: of +
                (this.form.value.paAmount ? Number(this.form.value.paAmount) : 0) +
                (this.form.value.gobAmount ? Number(this.form.value.gobAmount) : 0) +
                (this.form.value.otherAmount ? Number(this.form.value.otherAmount) : 0)
        });
        this.form.patchValue({
            totalAmount: Number(this.form.value.totalAmount.toFixed(2))
        });
    }


    /**
     * set total value on changing pa
     */
    onPaChange() {
        this.form.patchValue({
            totalAmount: (this.form.value.rpaAmount ? Number(this.form.value.rpaAmount) : 0) +
                (this.form.value.dpaAmount ? Number(this.form.value.dpaAmount) : 0) +
                (this.form.value.gobAmount ? Number(this.form.value.gobAmount) : 0) +
                (this.form.value.ownFundAmount ? Number(this.form.value.ownFundAmount) : 0) +
                (this.form.value.otherAmount ? Number(this.form.value.otherAmount) : 0)
        });
        this.form.patchValue({
            totalAmount: Number(this.form.value.totalAmount.toFixed(2))
        });
    }

    /**
     * set total value on changing gob
     * @param $event
     */
    onGobChange($event: FocusEvent) {
        const gob = ($event.target['value']) ? Number($event.target['value']) : 0;
        if (this.form.value.feGobAmount > gob) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", ERROR);
            this.form.patchValue({feGobAmount: 0});
        }
        this.form.patchValue({
            totalAmount: gob +
                (this.form.value.paAmount ? Number(this.form.value.paAmount) : 0) +
                (this.form.value.ownFundAmount ? Number(this.form.value.ownFundAmount) : 0) +
                (this.form.value.otherAmount ? Number(this.form.value.otherAmount) : 0)
        });
        this.form.patchValue({
            totalAmount: Number(this.form.value.totalAmount.toFixed(2))
        });
    }

    /**
     * set total value on changing other
     * @param $event
     */
    onOtherChange($event: FocusEvent) {
        const other = ($event.target['value']) ? Number($event.target['value']) : 0;
        if (this.form.value.feOtherAmount > other) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Other", ERROR);
            this.form.patchValue({feOtherAmount: 0});
        }
        this.form.patchValue({
            totalAmount: other +
                (this.form.value.paAmount ? Number(this.form.value.paAmount) : 0) +
                (this.form.value.ownFundAmount ? Number(this.form.value.ownFundAmount) : 0) +
                (this.form.value.gobAmount ? Number(this.form.value.gobAmount) : 0)
        });
        this.form.patchValue({
            totalAmount: Number(this.form.value.totalAmount.toFixed(2))
        });
    }

    /**
     * Calling Optional COFOG during set Main COFOG
     * @param id
     */
    onchangeMain(id: number) {
        this.subscribe$.add(
            this.optionalCofogService.getByMainCofogId(id).subscribe(res => {
                this.optionals = res;
            })
        );
    }

    /**
     * Calling Detail COFOG during set Detail COFOG
     * @param id
     */
    onchangeOptional(id: number) {
        this.subscribe$.add(
            this.detailsCofogService.getByOptionalCofogId(id).subscribe(res => {
                this.details = res;
            })
        );
    }

    /**
     * Calling Sector during set Sector Division
     * @param id
     */
    onchangeSectorDivision(id: number) {
        this.subscribe$.add(
            this.sectorService.getBySectorDivisionId(id).subscribe(res => {
                this.sectors = res;
            })
        );
    }

    /**
     * Add project code on changing Sub Sector
     */
    onchangeSubSector() {
        this.form.patchValue({
            projectCode: this.sectorsDivisions.find(f => f.id === this.form.value.sectorDivisionId).sectorDivisionNameEn.concat('-')
                .concat(this.sectors.find(f => f.id === this.form.value.sectorId).sectorNameEn).concat('-')
                .concat(this.subSectors.find(f => f.id === this.form.value.subSectorId).subSectorNameEn).concat('-')
                .concat(new Date(this.form.value.expCommencementDate).getUTCDate().toString()).concat('-')
                .concat(new Date(this.form.value.expCompletionDate).getUTCDate().toString())
        });
    }


    /**
     * For existing after save
     */
    saveAndExit(): void {
        if (this.form.valid && this.summaryForm.valid) {
            this.saveData(false);
        } else {
            this.form.markAllAsTouched();
            this.summaryForm.markAllAsTouched();
            this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }
    }

    updateAndExit(): void {
        if (this.form.valid && this.summaryForm.valid) {
            this.updateData(false);

        } else {
            this.form.markAllAsTouched();
            this.summaryForm.markAllAsTouched();
            this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }
    }

    /**
     * For next TAB
     */

    nextTab(): void {
        this.nextStep.emit(true);
    }





    /**
     * Save Data
     * @param next
     * @private
     */
    private saveData(next: boolean) {
        this.create(next);
    }

    private updateData(next: boolean) {
        this.createOrUpdate(next);
    }

    /**
     * For Create
     * @param next
     * @private
     */
    private create(next: boolean) {
        let projectConcept: IProjectConcept = this.form.value;
        projectConcept.projectConceptSummary = this.summaryForm.value;
        this.spinner = true;
        this.subscribe$.add(
            this.service.create(projectConcept).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();

                    this.router.navigate(['feasibility-study']);

                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.spinner = false;
            }, error => {
                this.snackbarHelper.openErrorSnackBarWithMessage(error.error.message, 'OK');
                this.spinner = false;
            })
        );
    }


    private createOrUpdate(next: boolean) {
        let projectConcept: IProjectConcept = this.form.value;
        projectConcept.projectConceptSummary = this.summaryForm.value;
        this.spinner = true;
        this.subscribe$.add(
            this.service.create(projectConcept).subscribe(res => {
                this.update(true);
                this.spinner = false;
            }, error => {
                this.snackbarHelper.openErrorSnackBarWithMessage(error.message, error.status);
                this.spinner = false;
            })
        );
    }

    /**
     * For Update
     * @param next
     * @private
     */
    private update(next: boolean) {
        let projectConcept: IProjectConcept = this.updateForm.value;
        projectConcept.projectConceptSummary = this.updateSummaryForm.value;

        // projectConcept.gobAmount = Number(projectConcept.gobAmount).toFixed(2);
        // projectConcept.otherAmount = Number(projectConcept.otherAmount).toFixed(2);
        // projectConcept.ownFundAmount = Number(projectConcept.ownFundAmount).toFixed(2);
        // projectConcept.paAmount = Number(projectConcept.paAmount).toFixed(2);
        // projectConcept.dpaAmount = Number(projectConcept.dpaAmount).toFixed(2);
        // projectConcept.rpaAmount = Number(projectConcept.rpaAmount).toFixed(2);
        // projectConcept.totalAmount = Number(projectConcept.totalAmount).toFixed(2);
        // projectConcept.feGobAmount = Number(projectConcept.feGobAmount).toFixed(2);
        // projectConcept.feOtherAmount = Number(projectConcept.feOtherAmount).toFixed(2);
        // projectConcept.feOwnFundAmount = Number(projectConcept.feOwnFundAmount).toFixed(2);

        this.subscribe$.add(
            this.service.update(projectConcept).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.router.navigate(['feasibility-study']);
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
            }, error => {
                this.snackbarHelper.openErrorSnackBarWithMessage(error.statusText, error.status);
            })
        );
    }

    /**
     * Calling Sub-Sector during set Sector
     * @param id
     */
    onchangeSector(id: number) {
        this.subscribe$.add(
            this.subSectorService.getBySectorId(id).subscribe(res => {
                this.subSectors = res;
            })
        );
    }


    /**
     * For initializing form
     * @private
     */
    private populateForm(): void {
        this.form = new FormGroup({
            projectCode: new FormControl(''),
            projectTypeId: new FormControl('', [Validators.required]),
            priorityId: new FormControl(1, ),
            titleEn: new FormControl('', [Validators.required]),
            titleBn: new FormControl('',[Validators.required] ),
            objectivesEn: new FormControl('', ),
            objectivesBn: new FormControl('', ),
            expCommencementDate: new FormControl('', [Validators.required]),
            expCompletionDate: new FormControl('', [Validators.required]),
            totalAmount: new FormControl(0, ),
            gobAmount: new FormControl(0, ),
            feGobAmount: new FormControl(0, ),
            ownFundAmount: new FormControl(0),
            feOwnFundAmount: new FormControl(0),
            paAmount: new FormControl(0),
            rpaAmount: new FormControl(0),
            dpaAmount: new FormControl(0),
            otherAmount: new FormControl(0),
            feOtherAmount: new FormControl(0),
            sectorDivisionId: new FormControl('', [Validators.required]),
            sectorId: new FormControl('', [Validators.required]),
            subSectorId: new FormControl('', [Validators.required]),
            mainCofogId: new FormControl(0, ),
            optionalCofogId: new FormControl(0, ),
            detailsCofogId: new FormControl(0, ),
            isSelfFund: new FormControl('false', ),
            isForeignAid: new FormControl('false', [Validators.required]),
            agreementNo: new FormControl(''),
            agreementAttachmentId: new FormControl(''),
            agreementAttachment: new FormControl(''),
            sponsoringMinistryName: new FormControl(this.ministry_name),
            implementingAgencyName: new FormControl(this.agency_name),
            sourceModuleType: new FormControl('FS'),
        });

        this.summaryForm = new FormGroup({
            catEnvRulesId: new FormControl(''),
            isEcaRequired: new FormControl('false', ),
            descriptionEca: new FormControl(''),
            ecaAttachmentId: new FormControl(''),
            isEiaRequired: new FormControl('false', ),
            descriptionEia: new FormControl(''),
            eiaAttachmentId: new FormControl(''),
            isLandRequired: new FormControl('false', ),
            descriptionLand: new FormControl(''),
            landAttachmentId: new FormControl(''),
            isFeasibilityRequired: new FormControl('true', ),
            descriptionFs: new FormControl(''),
            fsAttachmentId: new FormControl(''),
            isPppRequired: new FormControl('false', ),
            descriptionPpp: new FormControl(''),
            pppAttachmentId: new FormControl(''),
            relevanceWithShortProgram: new FormControl('', ),
            relevanceWithShortProgramAttachmentId: new FormControl(''),
            relevanceWithProposal: new FormControl('', ),
            relevanceWithProposalAttachmentId: new FormControl(''),
            institutionalArrangement: new FormControl('', ),
            institutionalArrangementAttachmentId: new FormControl(''),
            relevanceWithOtherDevelopment: new FormControl('', ),
            relevanceWithOtherDevelopmentAttachmentId: new FormControl(''),
            expectedBenefits: new FormControl('', ),
            expectedBenefitsAttachmentId: new FormControl(''),
            ecaAttachment: new FormControl(''),
            landAttachment: new FormControl(''),
            fsAttachment: new FormControl(''),
            pppAttachment: new FormControl(''),
            relevanceWithShortProgramAttachment: new FormControl(''),
            relevanceWithProposalAttachment: new FormControl(''),
            institutionalArrangementAttachment: new FormControl(''),
            relevanceWithOtherDevelopmentAttachment: new FormControl(''),
            expectedBenefitsAttachment: new FormControl(''),
        });
        this.show = false;
    }

    private updatePopulateForm(): void {
        this.updateForm = new FormGroup({
            uuid: new FormControl(this.projectSummary.uuid),
            projectCode: new FormControl(this.projectSummary.projectCode),
            projectTypeId: new FormControl(this.projectSummary.projectTypeId, ),
            priorityId: new FormControl(this.projectSummary.priorityId, [Validators.required]),
            titleEn: new FormControl(this.projectSummary.titleEn, [Validators.required]),
            titleBn: new FormControl(this.projectSummary.titleBn, [Validators.required]),
            objectivesEn: new FormControl(this.projectSummary.objectivesEn, [Validators.required]),
            objectivesBn: new FormControl(this.projectSummary.objectivesBn, [Validators.required]),
            expCommencementDate: new FormControl(this.projectSummary.expCommencementDate, [Validators.required]),
            expCompletionDate: new FormControl(this.projectSummary.expCompletionDate, [Validators.required]),
            totalAmount: new FormControl(this.projectSummary.totalAmount, [Validators.required]),
            gobAmount: new FormControl(this.projectSummary.gobAmount, [Validators.required, Validators.min(1)]),
            feGobAmount: new FormControl(this.projectSummary.feGobAmount, [Validators.required, Validators.min(0)]),
            ownFundAmount: new FormControl(this.projectSummary.ownFundAmount),
            feOwnFundAmount: new FormControl(this.projectSummary.feOwnFundAmount),
            paAmount: new FormControl(this.projectSummary.paAmount),
            rpaAmount: new FormControl(this.projectSummary.rpaAmount),
            dpaAmount: new FormControl(this.projectSummary.dpaAmount),
            otherAmount: new FormControl(this.projectSummary.otherAmount),
            feOtherAmount: new FormControl(this.projectSummary.feOtherAmount),
            sectorDivisionId: new FormControl(this.projectSummary.sectorDivisionId, [Validators.required]),
            sectorId: new FormControl(this.projectSummary.sectorId, [Validators.required]),
            subSectorId: new FormControl(this.projectSummary.subSectorId, [Validators.required]),
            mainCofogId: new FormControl(this.projectSummary.mainCofogId, [Validators.required]),
            optionalCofogId: new FormControl(this.projectSummary.optionalCofogId, [Validators.required]),
            detailsCofogId: new FormControl(this.projectSummary.detailsCofogId, [Validators.required]),
            isSelfFund: new FormControl(String(this.projectSummary.isSelfFund.toString()), [Validators.required]),
            isForeignAid: new FormControl(String(this.projectSummary.isForeignAid.toString()), [Validators.required]),
            agreementNo: new FormControl(this.projectSummary.agreementNo),
            agreementAttachmentId: new FormControl(this.projectSummary.agreementAttachmentId),
            agreementAttachment: new FormControl(''),

            sponsoringMinistryName: new FormControl(this.projectSummary.sponsoringMinistryName),
            implementingAgencyName: new FormControl(this.projectSummary.implementingAgencyName),
            sourceModuleType: new FormControl('UPDATE_PC'),
        });

        this.updateSummaryForm = new FormGroup({
            uuid: new FormControl(this.projectSummary.projectConceptSummary.uuid),
            catEnvRulesId: new FormControl(this.projectSummary.projectConceptSummary.catEnvRulesId),
            isEcaRequired: new FormControl(String(this.projectSummary.projectConceptSummary.isEcaRequired.toString()), [Validators.required]),
            descriptionEca: new FormControl(this.projectSummary.projectConceptSummary.descriptionEca),
            ecaAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.ecaAttachmentId),
            isEiaRequired: new FormControl(String(this.projectSummary.projectConceptSummary.isEiaRequired.toString()), [Validators.required]),
            descriptionEia: new FormControl(this.projectSummary.projectConceptSummary.descriptionEia),
            eiaAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.eiaAttachmentId),
            isLandRequired: new FormControl(String(this.projectSummary.projectConceptSummary.isLandRequired.toString()), [Validators.required]),
            descriptionLand: new FormControl(this.projectSummary.projectConceptSummary.descriptionLand),
            landAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.landAttachmentId),
            isFeasibilityRequired: new FormControl(String(this.projectSummary.projectConceptSummary.isFeasibilityRequired.toString()), [Validators.required]),
            descriptionFs: new FormControl(this.projectSummary.projectConceptSummary.descriptionFs),
            fsAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.fsAttachmentId),
            isPppRequired: new FormControl(String(this.projectSummary.projectConceptSummary.isPppRequired.toString()), [Validators.required]),
            descriptionPpp: new FormControl(this.projectSummary.projectConceptSummary.descriptionPpp),
            pppAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.pppAttachmentId),
            relevanceWithShortProgram: new FormControl(this.projectSummary.projectConceptSummary.relevanceWithShortProgram, [Validators.required]),
            relevanceWithShortProgramAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.relevanceWithShortProgramAttachmentId),
            relevanceWithProposal: new FormControl(this.projectSummary.projectConceptSummary.relevanceWithProposal, [Validators.required]),
            relevanceWithProposalAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.relevanceWithProposalAttachmentId),
            institutionalArrangement: new FormControl(this.projectSummary.projectConceptSummary.institutionalArrangement, [Validators.required]),
            institutionalArrangementAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.institutionalArrangementAttachmentId),
            relevanceWithOtherDevelopment: new FormControl(this.projectSummary.projectConceptSummary.relevanceWithOtherDevelopment, [Validators.required]),
            relevanceWithOtherDevelopmentAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.relevanceWithOtherDevelopmentAttachmentId),
            expectedBenefits: new FormControl(this.projectSummary.projectConceptSummary.expectedBenefits, [Validators.required]),
            expectedBenefitsAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.expectedBenefitsAttachmentId),
            ecaAttachment: new FormControl(''),
            landAttachment: new FormControl(''),
            fsAttachment: new FormControl(''),
            pppAttachment: new FormControl(''),
            relevanceWithShortProgramAttachment: new FormControl(''),
            relevanceWithProposalAttachment: new FormControl(''),
            institutionalArrangementAttachment: new FormControl(''),
            relevanceWithOtherDevelopmentAttachment: new FormControl(''),
            expectedBenefitsAttachment: new FormControl(''),
        });
        this.show = false;
    }

    /**
     * Setting patch value during update
     * @private
     */
    private populateWithSettingFormPatchValue() {
        this.form = new FormGroup({
            uuid: new FormControl(this.projectSummary.uuid),
            projectCode: new FormControl(this.projectSummary.projectCode),
            projectTypeId: new FormControl(this.projectSummary.projectTypeId, [Validators.required]),
            priorityId: new FormControl(this.projectSummary.priorityId, [Validators.required]),
            titleEn: new FormControl(this.projectSummary.titleEn, [Validators.required]),
            titleBn: new FormControl(this.projectSummary.titleBn, [Validators.required]),
            objectivesEn: new FormControl(''),
            objectivesBn: new FormControl(''),
            expCommencementDate: new FormControl(this.projectSummary.expCommencementDate, [Validators.required]),
            expCompletionDate: new FormControl(this.projectSummary.expCompletionDate, [Validators.required]),
            totalAmount: new FormControl(0),
            gobAmount: new FormControl(0),
            feGobAmount: new FormControl(0),
            ownFundAmount: new FormControl(0),
            feOwnFundAmount: new FormControl(0),
            paAmount: new FormControl(0),
            rpaAmount: new FormControl(0),
            dpaAmount: new FormControl(0),
            otherAmount: new FormControl(0),
            feOtherAmount: new FormControl(0),
            sectorDivisionId: new FormControl(this.projectSummary.sectorDivisionId, [Validators.required]),
            sectorId: new FormControl(this.projectSummary.sectorId, [Validators.required]),
            subSectorId: new FormControl(this.projectSummary.subSectorId, [Validators.required]),
            mainCofogId: new FormControl(this.projectSummary.mainCofogId, [Validators.required]),
            optionalCofogId: new FormControl(this.projectSummary.optionalCofogId, [Validators.required]),
            detailsCofogId: new FormControl(this.projectSummary.detailsCofogId, [Validators.required]),
            isSelfFund: new FormControl(false),
            isForeignAid: new FormControl(String(this.projectSummary.isForeignAid.toString()), [Validators.required]),
            agreementNo: new FormControl(''),
            agreementAttachmentId: new FormControl(''),
            agreementAttachment: new FormControl(''),

            sponsoringMinistryName: new FormControl(this.projectSummary.sponsoringMinistryName),
            implementingAgencyName: new FormControl(this.projectSummary.implementingAgencyName),
            sourceModuleType: new FormControl('DPP_TAPP'),
        });

        this.summaryForm = new FormGroup({
            uuid: new FormControl(this.projectSummary.projectConceptSummary.uuid),
            catEnvRulesId: new FormControl(this.projectSummary.projectConceptSummary.catEnvRulesId),
            isEcaRequired: new FormControl(String(this.projectSummary.projectConceptSummary.isEcaRequired.toString()), [Validators.required]),
            descriptionEca: new FormControl(this.projectSummary.projectConceptSummary.descriptionEca),
            ecaAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.ecaAttachmentId),
            isEiaRequired: new FormControl(String(this.projectSummary.projectConceptSummary.isEiaRequired.toString()), [Validators.required]),
            descriptionEia: new FormControl(this.projectSummary.projectConceptSummary.descriptionEia),
            eiaAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.eiaAttachmentId),
            isLandRequired: new FormControl(String(this.projectSummary.projectConceptSummary.isLandRequired.toString()), [Validators.required]),
            descriptionLand: new FormControl(this.projectSummary.projectConceptSummary.descriptionLand),
            landAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.landAttachmentId),
            isFeasibilityRequired: new FormControl(String(this.projectSummary.projectConceptSummary.isFeasibilityRequired.toString()), [Validators.required]),
            descriptionFs: new FormControl(this.projectSummary.projectConceptSummary.descriptionFs),
            fsAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.fsAttachmentId),
            isPppRequired: new FormControl(String(this.projectSummary.projectConceptSummary.isPppRequired.toString()), [Validators.required]),
            descriptionPpp: new FormControl(this.projectSummary.projectConceptSummary.descriptionPpp),
            pppAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.pppAttachmentId),
            relevanceWithShortProgram: new FormControl(this.projectSummary.projectConceptSummary.relevanceWithShortProgram, [Validators.required]),
            relevanceWithShortProgramAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.relevanceWithShortProgramAttachmentId),
            relevanceWithProposal: new FormControl(this.projectSummary.projectConceptSummary.relevanceWithProposal, [Validators.required]),
            relevanceWithProposalAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.relevanceWithProposalAttachmentId),
            institutionalArrangement: new FormControl(this.projectSummary.projectConceptSummary.institutionalArrangement, [Validators.required]),
            institutionalArrangementAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.institutionalArrangementAttachmentId),
            relevanceWithOtherDevelopment: new FormControl(this.projectSummary.projectConceptSummary.relevanceWithOtherDevelopment, [Validators.required]),
            relevanceWithOtherDevelopmentAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.relevanceWithOtherDevelopmentAttachmentId),
            expectedBenefits: new FormControl(this.projectSummary.projectConceptSummary.expectedBenefits, [Validators.required]),
            expectedBenefitsAttachmentId: new FormControl(this.projectSummary.projectConceptSummary.expectedBenefitsAttachmentId),
            ecaAttachment: new FormControl(''),
            landAttachment: new FormControl(''),
            fsAttachment: new FormControl(''),
            pppAttachment: new FormControl(''),
            relevanceWithShortProgramAttachment: new FormControl(''),
            relevanceWithProposalAttachment: new FormControl(''),
            institutionalArrangementAttachment: new FormControl(''),
            relevanceWithOtherDevelopmentAttachment: new FormControl(''),
            expectedBenefitsAttachment: new FormControl(''),
        });
        this.show = false;
    }

    setValue(res){
        this.form.patchValue({
            uuid: res.uuid,
            projectCode: res.projectCode,
            projectTypeId: res.projectTypeId,
            priorityId: res.priorityId,
            titleEn: res.titleEn,
            titleBn: res.titleBn,
            objectivesEn: '',
            objectivesBn: '',
            expCommencementDate: res.expCommencementDate,
            expCompletionDate: res.expCompletionDate,
            totalAmount: 0,
            gobAmount: 0,
            feGobAmount: 0,
            ownFundAmount: 0,
            feOwnFundAmount: 0,
            paAmount: 0,
            rpaAmount: 0,
            dpaAmount: 0,
            otherAmount: 0,
            feOtherAmount: 0,
            sectorDivisionId: res.sectorDivisionId,
            sectorId: res.sectorId,
            subSectorId: res.subSectorId,
            mainCofogId: res.mainCofogId,
            optionalCofogId: res.optionalCofogId,
            detailsCofogId: res.detailsCofogId,
            isSelfFund: false,
            isForeignAid: res.isForeignAid.toString(),
            agreementNo: '',
            agreementAttachmentId: '',
            agreementAttachment: '',

            sponsoringMinistryName: res.sponsoringMinistryName,
            implementingAgencyName: res.implementingAgencyName,
            sourceModuleType: 'DPP_TAPP',
        });


    }



    // set Commencement Max Date
    completionDataChange($event: MatDatepickerInputEvent<Date>) {
        const value = new Date($event.value);
        this.expCommencementMaxDate = new Date(value.getFullYear(), value.getMonth(), value.getDate())
    }

    // set Completion Min Date
    commencementDataChange($event: MatDatepickerInputEvent<Date>) {
        const value = new Date($event.value);
        this.expCompletionMinDate = new Date(value.getFullYear(), value.getMonth(), value.getDate())
    }

    feGoBChange($event: Event) {
        const feValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const gobValue = this.form.value.gobAmount ? this.form.value.gobAmount : 0;
        if (feValue > gobValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than GOB", ERROR);
            this.form.patchValue({feGobAmount: 0});
        }
    }


    feOwnFundBChange($event: KeyboardEvent) {
        const feOwnFundValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const ownFundValue = this.form.value.gobAmount ? this.form.value.gobAmount : 0;
        if (feOwnFundValue > ownFundValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", ERROR);
            this.form.patchValue({feOwnFundAmount: 0});
        }
    }

    onChangePType($event: MatSelectChange) {
        if($event.value === 'Feasibility Study Report'){
            this.isFeasibilityStudyReport = true;
        }
        if($event.value === 'Feasibility Study Proposal'){
            this.isFeasibilityStudyReport = false;
        }
    }


}
