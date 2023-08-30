import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FuseTranslationLoaderService} from '../../../../../../../core/services/translation-loader.service';
import {SectorDivisionService} from '../../../../../../configuration-management/services/sector-division.service';
import {SectorService} from '../../../../../../configuration-management/services/sector.service';
import {SubSectorService} from '../../../../../../configuration-management/services/sub-sector.service';
import {MainCofogService} from '../../../../../../configuration-management/services/main-cofog.service';
import {OptionalCofogService} from '../../../../../../configuration-management/services/optional-cofog.service';
import {DetailsCofogService} from '../../../../../../configuration-management/services/details-cofog.service';
import {UnsubscribeAdapterComponent} from '../../../../../../../core/helper/unsubscribeAdapter';
import {map, switchMap} from 'rxjs/operators';
import {SectorDivisionModel} from '../../../../../../configuration-management/models/sector-division.model';
import {SectorModel} from '../../../../../../configuration-management/models/sector.model';
import {IMainCofog} from '../../../../../../configuration-management/models/main-cofog';
import {IOptionalCofog} from '../../../../../../configuration-management/models/optional-cofog';
import {IDetailsCofog} from '../../../../../../configuration-management/models/details-cofog';
import {SubSectorModel} from '../../../../../../configuration-management/models/sub-sector.model';
import {CategoryEnvironmentService} from '../../../../../../configuration-management/services/category-environment.service';
import {CategoryEnvironmentModel} from '../../../../../../configuration-management/models/categoryEnvironmentModel.model';
import {ProjectSummaryService} from '../../../../../services/project-summary.service';
import {FileUploadService} from '../../../../../../../core/services/file-upload.service';
import {DEFAULT_PAGE} from '../../../../../../../core/constants/constant';
import {ProjectTypeService} from '../../../../../../configuration-management/services/project-type.service';
import {ProjectType} from '../../../../../../configuration-management/models/project-type.model';
import {Router} from '@angular/router';
import {ProjectConceptService} from '../../../../../services/project-concept.service';
import {SnackbarHelper} from '../../../../../../../core/helper/snackbar.helper';
import {
    ERROR,
    FAILED_UPDATE,
    OK,
    SUCCESSFULLY_DELETED,
    SUCCESSFULLY_UPDATED
} from '../../../../../../../core/constants/message';

import {MEDIUM_EDITOR_CONFIG, MIN_EDITOR_CONFIG} from '../../../../../../../core/constants/editor-config';

import {ModeOfFinanceService} from "../../../../../services/mode-of-finance.service";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {PriorityService} from '../../../../../../configuration-management/services/priority.service';
import {IPriorityModel} from '../../../../../../configuration-management/models/priority.model';
import {IProjectConcept} from '../../../../../models/project-concept';
import {LocationHelperService} from '../../../../../../../shared/services/location-helper.service';
import {UtilsService} from 'app/main/core/services/utils.service';
import {UserGroupService} from "../../../../../../configuration-management/services/user-group.service";
import { of } from 'rxjs';
import {IProjectConceptSummary} from "../../../../../models/project-concept-summary";

@Component({
    selector: 'app-project-summary',
    templateUrl: './project-summary.component.html',
    styleUrls: ['./project-summary.component.scss']
})
export class ProjectSummaryComponent extends UnsubscribeAdapterComponent implements OnInit {

    minEditorConfig: any = MIN_EDITOR_CONFIG;
    mediumEditorConfig: any = MEDIUM_EDITOR_CONFIG;


    @Input() id: number;
    @Input() canEdit: boolean;
    @Output() nextStep = new EventEmitter<boolean>();
    @Output() projectConceptMasterId = new EventEmitter<number>();

    page: number = DEFAULT_PAGE;
    form: FormGroup;
    summaryForm: FormGroup;
    projectSummary: IProjectConcept = {} as IProjectConcept;
    sectorsDivisions: SectorDivisionModel[] = [];
    sectors: SectorModel[] = [];
    subSectors: SubSectorModel[] = [];
    mains: IMainCofog[] = [];
    optionals: IOptionalCofog[] = [];
    details: IDetailsCofog[] = [];
    category: CategoryEnvironmentModel[] = [];
    fileList: { field: string, file: FileList }[] = [];
    projectTypeList: ProjectType[] = [];
    priorityList: IPriorityModel[] = [];
    canUpdate: boolean = false;

    expCommencementMaxDate: Date;
    expCompletionMinDate: Date;

    toogleObj: boolean = false;
    expObjectiveEn: boolean = true;
    expObjectiveBn: boolean = true;
    expRelevanceWithShortProgram: boolean = true;
    expRelevanceOfProposal: boolean = true;
    expInstitutionalArrangement: boolean = true;
    expRelevanceWithDevelopment: boolean = true;
    expExpectedBenifit: boolean = true;
    show = true;

    userId : any;
    ministry_name: string;
    agency_name : string;
    file ; File;
    isAttachmentEnable: boolean;
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
        this.projectSummary.projectConceptSummary = {} as IProjectConceptSummary;
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

    uploadImageAsBase64(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.form, files, propertyName);
    }

    uploadImageAsBase641(files: any, propertyName: string) {
        this.utilsService.uploadImageAsBase64(this.summaryForm, files, propertyName);
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
                if (this.canUpdate) {
                    this.getProjectSummaryById();
                } else this.populateForm();
            })
        );
    }

    /**
     * calling project Summary
     * @private
     */
    private getProjectSummaryById() {
        this.subscribe$.add(
            this.service.getById(this.id).subscribe(res => {
                this.projectSummary = res;
                this.projectConceptService.projectSummaryCreateId = res.id;
                this.projectConceptService.projectSummaryCreateUuid = res.uuid;
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
                this.form.patchValue({ feasibilityStudy: 'Yes' });
            }
            this.form.patchValue({
                projectType: this.form.value.projectType.id
            });
        }
    }


    /**
     * Validation add during Total Change
     * @param value
     */
    onTotalChange(value: number): void {
        if (value) {
            if ((this.projectTypeList.find(f => f.id === value).nameEn === 'DPP') && (Number(value) >= 500000000)) {
                this.form.patchValue({ isFeasibilityRequired: true });
            }
            this.form.patchValue({
                projectType: this.form.value.projectType.id
            });
        }

    }

    /**
     * deleting agreement attachment
     */
    deleteAgreementAttachment() {
        this.form.controls['agreementAttachment'].setValue(null, { emitEvent: false });
        if (this.projectSummary.agreementAttachmentId) {
            this.summaryForm.patchValue({ agreementAttachmentId: null });
            this.deleteById(this.projectSummary.agreementAttachmentId);
            this.projectSummary.agreementAttachmentId = null;
            this.projectSummary.agreementAttachmentName = '';
        }
    }

    /**
     * deleting attachment
     * @param value
     */
    delete(value: string) {

        this.summaryForm.controls[value].setValue(null, { emitEvent: false });
        // if (field === 'agreementAttachmentId') {
        //     this.form.patchValue({agreementAttachmentId: id});
        // }
        if (value === 'ecaAttachment') {
            if (this.projectSummary.projectConceptSummary.ecaAttachmentId) {
                this.summaryForm.patchValue({ ecaAttachmentId: null });
                this.deleteById(this.projectSummary.projectConceptSummary.ecaAttachmentId);
                this.projectSummary.projectConceptSummary.ecaAttachmentId = null;
                this.projectSummary.projectConceptSummary.ecaAttachmentName = '';
            }
        }
        if (value === 'eiaAttachment') {
            if (this.projectSummary.projectConceptSummary.eiaAttachmentId) {
                this.summaryForm.patchValue({ eiaAttachmentId: null });
                this.deleteById(this.projectSummary.projectConceptSummary.eiaAttachmentId);
                this.projectSummary.projectConceptSummary.eiaAttachmentId = null;
                this.projectSummary.projectConceptSummary.eiaAttachmentName = '';
            }
        }
        if (value === 'landAttachment') {
            if (this.projectSummary.projectConceptSummary.landAttachmentId) {
                this.summaryForm.patchValue({ landAttachmentId: null });
                this.deleteById(this.projectSummary.projectConceptSummary.landAttachmentId);
                this.projectSummary.projectConceptSummary.landAttachmentId = null;
                this.projectSummary.projectConceptSummary.landAttachmentName = '';
            }
        }
        if (value === 'fsAttachment') {
            if (this.projectSummary.projectConceptSummary.fsAttachmentId) {
                this.deleteById(this.projectSummary.projectConceptSummary.fsAttachmentId);
                this.projectSummary.projectConceptSummary.fsAttachmentId = null;
                this.summaryForm.patchValue({ fsAttachmentId: null });
                this.projectSummary.projectConceptSummary.fsAttachmentName = '';
            }
        }
        if (value === 'pppAttachment') {
            if (this.projectSummary.projectConceptSummary.pppAttachmentId) {
                this.summaryForm.patchValue({ pppAttachmentId: null });
                this.deleteById(this.projectSummary.projectConceptSummary.pppAttachmentId);
                this.projectSummary.projectConceptSummary.pppAttachmentId = null;
                this.projectSummary.projectConceptSummary.pppAttachmentName = '';
            }
        }
        if (value === 'relevanceWithShortProgramAttachment') {
            if (this.projectSummary.projectConceptSummary.relevanceWithShortProgramAttachmentId) {
                this.summaryForm.patchValue({ relevanceWithShortProgramAttachmentId: null });
                this.deleteById(this.projectSummary.projectConceptSummary.relevanceWithShortProgramAttachmentId);
                this.projectSummary.projectConceptSummary.relevanceWithShortProgramAttachmentId = null;
                this.projectSummary.projectConceptSummary.relevanceWithShortProgramAttachmentName = '';
            }
        }
        if (value === 'relevanceWithProposalAttachment') {
            if (this.projectSummary.projectConceptSummary.relevanceWithProposalAttachmentId) {
                this.summaryForm.patchValue({ relevanceWithProposalAttachmentId: null });
                this.deleteById(this.projectSummary.projectConceptSummary.relevanceWithProposalAttachmentId);
                this.projectSummary.projectConceptSummary.relevanceWithProposalAttachmentId = null;
                this.projectSummary.projectConceptSummary.relevanceWithProposalAttachmentName = '';
            }
        }
        if (value === 'institutionalArrangementAttachment') {
            if (this.projectSummary.projectConceptSummary.institutionalArrangementAttachmentId) {
                this.summaryForm.patchValue({ institutionalArrangementAttachmentId: null });
                this.deleteById(this.projectSummary.projectConceptSummary.institutionalArrangementAttachmentId);
                this.projectSummary.projectConceptSummary.institutionalArrangementAttachmentId = null;
                this.projectSummary.projectConceptSummary.institutionalArrangementAttachmentName = '';
            }
        }
        if (value === 'relevanceWithOtherDevelopmentAttachment') {
            if (this.projectSummary.projectConceptSummary.relevanceWithOtherDevelopmentAttachmentId) {
                this.summaryForm.patchValue({ relevanceWithOtherDevelopmentAttachmentId: null });
                this.deleteById(this.projectSummary.projectConceptSummary.relevanceWithOtherDevelopmentAttachmentId);
                this.projectSummary.projectConceptSummary.relevanceWithOtherDevelopmentAttachmentId = null;
                this.projectSummary.projectConceptSummary.relevanceWithOtherDevelopmentAttachmentName = '';
            }
        }
        if (value === 'expectedBenefitsAttachment') {
            if (this.projectSummary.projectConceptSummary.expectedBenefitsAttachmentId) {
                this.summaryForm.patchValue({ expectedBenefitsAttachmentId: null });
                this.deleteById(this.projectSummary.projectConceptSummary.expectedBenefitsAttachmentId);
                this.projectSummary.projectConceptSummary.expectedBenefitsAttachmentId = null;
                this.projectSummary.projectConceptSummary.expectedBenefitsAttachmentName = '';
            }
        }

    }

    private deleteById(id: number) {
        let projectConcept: IProjectConcept = this.form.value;
        projectConcept.projectConceptSummary = this.summaryForm.value;
        this.spinner = true;
        this.fileUploadService.deleteById(id).subscribe(
            res => {
                if (res && projectConcept && projectConcept.uuid) {
                    this.service.update(projectConcept).subscribe(res => {
                        if (res) {
                            this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                        }
                    })
                } else {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_DELETED, OK);
                }
            }
        );
        this.spinner = false;
    }

    /**
     * set total value on changing own fund
     * @param $event
     */
    onOwnFundChange($event: FocusEvent) {
        const of = ($event.target['value']) ? Number($event.target['value']) : 0;
        if (this.form.value.feOwnFundAmount > of) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", ERROR);
            this.form.patchValue({ feOwnFundAmount: 0 });
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
     * set pa value on changing rpa
     * @param $event
     */
    onRpaChange($event: FocusEvent) {
        const rpa = ($event.target['value']) ? Number($event.target['value']) : 0;
        this.form.patchValue({
            paAmount: rpa + (this.form.value.dpaAmount ? Number(this.form.value.dpaAmount) : 0),
        });
        this.onPaChange();
    }

    /**
     * set pa value on changing rpa
     * @param $event
     */
    onDpaChange($event: FocusEvent) {
        const dpa = ($event.target['value']) ? Number($event.target['value']) : 0;
        this.form.patchValue({
            paAmount: dpa + (this.form.value.rpaAmount ? Number(this.form.value.rpaAmount) : 0),
        });
        this.onPaChange();
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
            this.form.patchValue({ feGobAmount: 0 });
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
            this.form.patchValue({ feOtherAmount: 0 });
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
     * For going next tab after save
     */
    saveAndNext(): void {
        if (this.form.valid && this.summaryForm.valid) {
            this.save(true);
        } else {
            this.form.markAllAsTouched();
            this.summaryForm.markAllAsTouched();
            this.snackbarHelper.openWarnSnackBarWithMessage("You missed some required field, Please fill all the required field", "Ok");
        }
    }

    /**
     * For existing after save
     */
    saveAndExit(): void {
        if (this.form.valid && this.summaryForm.valid) {
            this.save(false);
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
     * Calling Save
     * @param next
     * @private
     */
    private save(next: boolean) {
        if (this.fileList.length > 0) {
            for (let i = 0; i < this.fileList.length; i++) {
                this.upload(this.fileList[i].file, this.fileList[i].field, (i === (this.fileList.length - 1)), next);
            }
            // this.fileList.forEach(e => {
            //     a += 1;
            //     this.upload(e.file, e.field, (a === this.fileList.length), next);
            // });
        } else {
            this.saveData(next);
        }
    }

    /**
     * Save Upload File and Data
     * @param files
     * @param field
     * @param save
     * @param next
     */
    upload(files: FileList, field: string, save: boolean, next: boolean) {
        const file = files.item(0);
        this.spinner = true;
        this.subscribe$.add(
            this.fileUploadService.upload(file).subscribe(res => {
                this.setAttachmentValue(field, res.id, save, next);
                // if (save) {
                //     this.saveData(next);
                // }
                this.spinner = false;
            })
        );
    }

    /**
     * Save Data
     * @param next
     * @private
     */
    private saveData(next: boolean) {
        this.canUpdate ? this.update(next) : this.create(next);
    }

    /**
     * For Create
     * @param next
     * @private
     */
    private create(next: boolean) {
        let projectConcept: IProjectConcept = this.form.value;
        projectConcept.projectConceptSummary = this.summaryForm.value;

        // projectConcept.gobAmount = Number(projectConcept.gobAmount.toFixed(2));
        // projectConcept.otherAmount = Number(projectConcept.otherAmount.toFixed(2));
        // projectConcept.ownFundAmount = Number(projectConcept.ownFundAmount.toFixed(2));
        // projectConcept.paAmount = Number(projectConcept.paAmount.toFixed(2));
        // projectConcept.dpaAmount = Number(projectConcept.dpaAmount.toFixed(2));
        // projectConcept.rpaAmount = Number(projectConcept.rpaAmount.toFixed(2));
        // projectConcept.totalAmount = Number(projectConcept.totalAmount.toFixed(2));
        // projectConcept.feGobAmount = Number(projectConcept.feGobAmount.toFixed(2));
        // projectConcept.feOtherAmount = Number(projectConcept.feOtherAmount.toFixed(2));
        // projectConcept.feOwnFundAmount = Number(projectConcept.feOwnFundAmount.toFixed(2));
        this.spinner = true;
        this.subscribe$.add(
            this.service.create(projectConcept).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBar();
                    if (next) {
                        this.projectSummary = res;
                        this.id = res.id;
                        this.form.value.uuid = res.uuid;
                        this.projectConceptMasterId.emit(res.id);
                        this.projectConceptService.projectSummaryCreateId = res.id;
                        this.projectConceptService.projectSummaryCreateUuid = res.uuid;
                        this.modeOfFinanceService.projectSummarySaveClickEvent();
                        this.nextStep.emit(true);
                        this.canUpdate = true;
                    } else {
                        this.navigateToList();
                    }
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

    /**
     * For Update
     * @param next
     * @private
     */
    private update(next: boolean) {
        let projectConcept: IProjectConcept = this.form.value;
        projectConcept.projectConceptSummary = this.summaryForm.value;

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
        this.spinner = true;
        this.subscribe$.add(
            this.service.update(projectConcept).subscribe(res => {
                if (res.uuid) {
                    this.snackbarHelper.openSuccessSnackBarWithMessage(SUCCESSFULLY_UPDATED, OK);
                    if (next) {
                        this.projectSummary = res;
                        this.projectConceptMasterId.emit(res.id);
                        this.projectConceptService.projectSummaryCreateId = res.id;
                        this.projectConceptService.projectSummaryCreateUuid = res.uuid;
                        this.modeOfFinanceService.projectSummarySaveClickEvent();
                        this.locationHelperService.setProjectLocationEvent();
                        this.nextStep.emit(true);
                    } else {
                        this.navigateToList();
                    }
                } else {
                    this.snackbarHelper.openErrorSnackBarWithMessage(FAILED_UPDATE, ERROR);
                }
                this.spinner = false;
            }, error => {
                this.snackbarHelper.openErrorSnackBarWithMessage(error.statusText, error.status);
                this.spinner = false;
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
     * For uploading File
     * @param files
     * @param field
     * @param name
     */
    // uploadFile(files: FileList, field: string, name: string) {
    //     if (this.projectSummary) {
    //         this.projectSummary.projectConceptSummary[name] = '';
    //         if (name === 'agreementAttachmentName') {
    //             this.projectSummary[name] = '';
    //         }
    //     }
    //     // this.projectSummary[name] = '';
    //     if (this.fileList.find(f => f.field === field)) {
    //         this.fileList.splice(this.fileList.findIndex(f => f.field === field), 1);
    //         // const name = files.item(0).name;
    //         // @ts-ignore
    //         // files.item(0)['name'] = name + Math.floor(Math.random() * (files.item(0)['name'].length + 1));
    //         this.fileList.push({ field: field, file: files });
    //     } else {
    //         this.fileList.push({ field: field, file: files });
    //     }
    //
    // }

    uploadFile(file: FileList, type : string, name: string): any {
        this.file = file.item(0);
        this.spinner = true;;
        this.fileUploadService.upload(this.file).subscribe(res => {
            console.log("file.............", res)
            this.spinner = false;
            if(res.id) {
                this.snackbarHelper.openSuccessSnackBarWithMessage('Attachment Successfully Save', 'Ok');
                this.setAttachmentValue(type, res.id, true, true)
            }
        }, error => {
            console.log(error);
            this.spinner = false;
            this.snackbarHelper.openErrorSnackBarWithMessage('Error File is not save', 'Ok');
        });
    }

    /**
     * For downloading File
     * @param field
     */
    download(field: string) {
        let id = this.projectSummary.projectConceptSummary[field]
        // if (field === 'agreementAttachmentId') {
        //     id = this.projectSummary[field];
        // }

        this.spinner = true;
        this.subscribe$.add(
            this.fileUploadService.getById(id).subscribe(res => {
                this.fileUploadService.download(res.pathUrl);
                this.spinner = false;
            }));
    }


    /**
     * Navigate To list
     */
    navigateToList() {
        this.router.navigate([`project-concept`]);
    }

    /**
     * For Expanding CK Editor
     * @param i
     */
    expand(i: number): void {
        if (i === 1) {
            this.expObjectiveEn = true;
        }
        if (i === 2) {
            this.expObjectiveBn = true;
        }
        if (i === 3) {
            this.expRelevanceWithShortProgram = true;
        }
        if (i === 4) {
            this.expRelevanceOfProposal = true;
        }
        if (i === 5) {
            this.expInstitutionalArrangement = true;
        }
        if (i === 6) {
            this.expRelevanceWithDevelopment = true;
        }
        if (i === 7) {
            this.expExpectedBenifit = true;
        }
    }

    /**
     * For Collapsing CK Editor
     * @param i
     */
    collapse(i: number): void {
        if (i === 1) {
            this.expObjectiveEn = false;
        }
        if (i === 2) {
            this.expObjectiveBn = false;
        }
        if (i === 3) {
            this.expRelevanceWithShortProgram = false;
        }
        if (i === 4) {
            this.expRelevanceOfProposal = false;
        }
        if (i === 5) {
            this.expInstitutionalArrangement = false;
        }
        if (i === 6) {
            this.expRelevanceWithDevelopment = false;
        }
        if (i === 7) {
            this.expExpectedBenifit = false;
        }
    }


    /**
     * For initializing form
     * @private
     */
    private populateForm(): void {
        this.form = new FormGroup({
            projectCode: new FormControl(''),
            projectTypeId: new FormControl('', [Validators.required]),
            priorityId: new FormControl('', [Validators.required]),
            titleEn: new FormControl('', [Validators.required]),
            titleBn: new FormControl('', [Validators.required]),
            objectivesEn: new FormControl('', [Validators.required]),
            objectivesBn: new FormControl('', [Validators.required]),
            expCommencementDate: new FormControl('', [Validators.required]),
            expCompletionDate: new FormControl('', [Validators.required]),
            totalAmount: new FormControl(0, [Validators.required]),
            gobAmount: new FormControl(0, [Validators.required, Validators.min(1)]),
            feGobAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
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
            mainCofogId: new FormControl(''),
            optionalCofogId: new FormControl(''),
            detailsCofogId: new FormControl(''),
            isSelfFund: new FormControl('false', [Validators.required]),
            isForeignAid: new FormControl('false', [Validators.required]),
            agreementNo: new FormControl(''),
            agreementAttachmentId: new FormControl(''),
            agreementAttachment: new FormControl(''),
            sponsoringMinistryName: new FormControl(this.ministry_name),
            implementingAgencyName: new FormControl(this.agency_name),
            sourceModuleType: new FormControl('PC'),
        });

        this.summaryForm = new FormGroup({
            catEnvRulesId: new FormControl(''),
            isEcaRequired: new FormControl('false', [Validators.required]),
            descriptionEca: new FormControl(''),
            ecaAttachmentId: new FormControl(''),
            isEiaRequired: new FormControl('false', [Validators.required]),
            descriptionEia: new FormControl(''),
            eiaAttachmentId: new FormControl(''),
            isLandRequired: new FormControl('false', [Validators.required]),
            descriptionLand: new FormControl(''),
            landAttachmentId: new FormControl(''),
            isFeasibilityRequired: new FormControl('false', [Validators.required]),
            descriptionFs: new FormControl(''),
            fsAttachmentId: new FormControl(''),
            isPppRequired: new FormControl('false', [Validators.required]),
            descriptionPpp: new FormControl(''),
            pppAttachmentId: new FormControl(''),
            relevanceWithShortProgram: new FormControl('', [Validators.required]),
            relevanceWithShortProgramAttachmentId: new FormControl(''),
            relevanceWithProposal: new FormControl('', [Validators.required]),
            relevanceWithProposalAttachmentId: new FormControl(''),
            institutionalArrangement: new FormControl('', [Validators.required]),
            institutionalArrangementAttachmentId: new FormControl(''),
            relevanceWithOtherDevelopment: new FormControl('', [Validators.required]),
            relevanceWithOtherDevelopmentAttachmentId: new FormControl(''),
            expectedBenefits: new FormControl('', [Validators.required]),
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
            mainCofogId: new FormControl(this.projectSummary.mainCofogId),
            optionalCofogId: new FormControl(this.projectSummary.optionalCofogId),
            detailsCofogId: new FormControl(this.projectSummary.detailsCofogId),
            isSelfFund: new FormControl(String(this.projectSummary.isSelfFund.toString()), [Validators.required]),
            isForeignAid: new FormControl(String(this.projectSummary.isForeignAid.toString()), [Validators.required]),
            agreementNo: new FormControl(this.projectSummary.agreementNo),
            agreementAttachmentId: new FormControl(this.projectSummary.agreementAttachmentId),
            agreementAttachment: new FormControl(''),

            sponsoringMinistryName : new FormControl(this.projectSummary.sponsoringMinistryName),
            implementingAgencyName : new FormControl(this.projectSummary.implementingAgencyName),
            sourceModuleType : new FormControl(this.projectSummary.sourceModuleType),
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


    /**
     * Set attachment patch value
     * @param field
     * @param id
     * @param save
     * @param next
     * @private
     */
    private setAttachmentValue(field: string, id: number, save: boolean, next: boolean) {
        if (field === 'agreementAttachmentId') {
            this.form.patchValue({ agreementAttachmentId: id });
            this.projectSummary.projectConceptSummary.agreementAttachmentId = id;
        }
        if (field === 'ecaAttachmentId') {
            this.summaryForm.patchValue({ ecaAttachmentId: id });
            this.projectSummary.projectConceptSummary.ecaAttachmentId = id;
        }
        if (field === 'eiaAttachmentId') {
            this.summaryForm.patchValue({ eiaAttachmentId: id });
            this.projectSummary.projectConceptSummary.eiaAttachmentId = id;
        }
        if (field === 'landAttachmentId') {
            this.summaryForm.patchValue({ landAttachmentId: id });
            this.projectSummary.projectConceptSummary.landAttachmentId = id;
        }
        if (field === 'fsAttachmentId') {
            this.summaryForm.patchValue({ fsAttachmentId: id });
            this.projectSummary.projectConceptSummary.fsAttachmentId = id;
        }
        if (field === 'pppAttachmentId') {
            this.summaryForm.patchValue({ pppAttachmentId: id });
            this.projectSummary.projectConceptSummary.pppAttachmentId = id;
        }
        if (field === 'relevanceWithShortProgramAttachmentId') {
            this.summaryForm.patchValue({ relevanceWithShortProgramAttachmentId: id });
            this.projectSummary.projectConceptSummary.relevanceWithShortProgramAttachmentId = id;
        }
        if (field === 'relevanceWithProposalAttachmentId') {
            this.summaryForm.patchValue({ relevanceWithProposalAttachmentId: id });
            this.projectSummary.projectConceptSummary.relevanceWithProposalAttachmentId = id;
        }
        if (field === 'institutionalArrangementAttachmentId') {
            this.summaryForm.patchValue({ institutionalArrangementAttachmentId: id });
            this.projectSummary.projectConceptSummary.institutionalArrangementAttachmentId = id;
        }
        if (field === 'relevanceWithOtherDevelopmentAttachmentId') {
            this.summaryForm.patchValue({ relevanceWithOtherDevelopmentAttachmentId: id });
            this.projectSummary.projectConceptSummary.relevanceWithOtherDevelopmentAttachmentId = id;
        }
        if (field === 'expectedBenefitsAttachmentId') {
            this.summaryForm.patchValue({ expectedBenefitsAttachmentId: id });
            this.projectSummary.projectConceptSummary.expectedBenefitsAttachmentId = id;
        }
        // if (save) {
        //     this.saveData(next);
        // }
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
            this.form.patchValue({ feGobAmount: 0 });
        }
    }

    feOtherChange($event: KeyboardEvent) {
        const feOtherValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const otherValue = this.form.value.otherAmount ? this.form.value.otherAmount : 0;
        if (feOtherValue > otherValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Other", ERROR);
            this.form.patchValue({ feOtherAmount: 0 });
        }
    }

    feOwnFundBChange($event: KeyboardEvent) {
        const feOwnFundValue = ($event.target['value']) ? Number($event.target['value']) : 0;
        const ownFundValue = this.form.value.gobAmount ? this.form.value.gobAmount : 0;
        if (feOwnFundValue > ownFundValue) {
            this.snackbarHelper.openErrorSnackBarWithMessage("Fe can’t be greater than Own Fund", ERROR);
            this.form.patchValue({ feOwnFundAmount: 0 });
        }
    }
}
