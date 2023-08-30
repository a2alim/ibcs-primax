import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ProfileMarksSetupService } from '../../services/ProfileMarksSetupService';
import { ProfileMarksSetup } from '../../models/ProfileMarksSetup';
import { DEFAULT_SIZE } from '../../../../core/constants/constant';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { SnackbarHelper } from '../../../../core/helper/snackbar.helper';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogConstant } from '../../../../shared/constant/confirm.dialog.constant';
import { SubmitConfirmationDialogComponent } from '../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
//----Lng Translation----
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { locale as lngEnglish } from './i18n/en';
import { locale as lngBangla } from './i18n/bn';
import { ResearchCategoryTypeService } from '../../services/research-category-type.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalValidationServiceService } from '../../../../core/services/global-validation-service.service';

@Component({
    selector: 'app-profile-marks-setup',
    templateUrl: './profile-marks-setup.component.html',
    styleUrls: ['./profile-marks-setup.component.scss'],
})
export class ProfileMarksSetupComponent implements OnInit {
    // Common Properties
    spinner: boolean = false;
    researchCategoryTypeList: any[] = [];
    frmGroup: FormGroup;
    isInstitutionalShow: boolean = false;
    isOthersShow: boolean = true;
    isMPhilOrPhdShow: boolean = true;
    isFellowshipShow: boolean = false;
    buttonText: string = 'Save';

    selectCategoryId:any = '';

    // Table
    dataSet: ProfileMarksSetup[] = new Array<ProfileMarksSetup>();

    //TODO: replace your data count in totalElements
    page: number = 0;
    totalElements: number = DEFAULT_SIZE;
    pageSize: number = DEFAULT_SIZE;

    //TODO: This is number of column for Mat Table
    displayedColumns: string[] = [
        'position',
        'research_category',
        'applicant_age',
        'marks_on_profession',
        'thesis_group',
        'action',
    ];

    //TODO: This is Mat Table Datasource
    dataSource = new MatTableDataSource(this.dataSet);

    constructor(
        private formBuilder: FormBuilder,
        private _profileMarksSetupService: ProfileMarksSetupService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private _globalValidator: GlobalValidationServiceService,
        private _researchCategoryTypeService: ResearchCategoryTypeService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        // Language translations
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
    }

    ngOnInit(): void {
        this.createForm();
        //Load Research Category
        this.getResearchCategoryTypeList();
        this.getAllProfileMarks();
    }

    createForm() {
        this.frmGroup = this.formBuilder.group({
            id: [],
            uuid: [],
            researchCategory: ['', Validators.required],
            applicantAge: [0, Validators.required],
            govEmployee: [0, Validators.required],
            marksOnProfession: [],
            marksOnSubjectRelevancy: [],
            firstDivision: [],
            secDivision: [],
            thirdDivision: [],
            postGraduateResultMarksFirst: [],
            postGraduateResultMarksSec: [],
            postGraduateResultMarksThird: [],
            mphil: [],
            phd: [],
            organizationStructure: [],
            organizationActivity: [],
            thesisGroup: [],
            nonThesis: [],
            marksIfPublishedInJournal: [],
            marksIfTrainedOnResearch: [],
            publishedJournalQtyLocal: [],
            publishedJournalQtyIntl: [],
            experienceYearsInResearchWork: [],

            researchExperience1:[],
            researchExperience2:[],
            researchExperience3:[],

            instPostGraduate1:[],
            instPostGraduate2:[],
            instMPhil1:[],
            instMPhil2:[],
            instPhd1:[],
            instPhd2:[],
            localPublication1:[],
            localPublication2:[],
            localPublication3:[],
            interPublication1:[],
            interPublication2:[],
            interPublication3:[],

            graduateCgpaFirst: [],
            graduateCgpaSecond: [],
            graduateCgpaThird: [],
        
            postGraduateCgpaFirst: [],
            postGraduateCgpaSecond: [],
            postGraduateCgpaThird: []
        });
    }

    onSelectedCategory(categoryId) {
        this.selectCategoryId = categoryId;
        const research: any = this.researchCategoryTypeList.filter(
            (res) => res.id === categoryId
        );
        switch (research[0].categoryName) {
            case 'Promotional':
                this.isInstitutionalShow = false;
                this.isOthersShow = true;
                this.isMPhilOrPhdShow = true;
                this.isFellowshipShow = false;
                break;
            case 'MPhil':
                this.isInstitutionalShow = false;
                this.isOthersShow = true;
                this.isMPhilOrPhdShow = false;
                this.isFellowshipShow = false;
                break;
            case 'PhD':
                this.isInstitutionalShow = false;
                this.isOthersShow = true;
                this.isMPhilOrPhdShow = false;
                this.isFellowshipShow = false;
                break;
            case 'Fellowship':
                this.isInstitutionalShow = false;
                this.isOthersShow = true;
                this.isMPhilOrPhdShow = true;
                this.isFellowshipShow = true;
                break;
            case 'Institutional':
                this.isInstitutionalShow = true;
                this.isOthersShow = false;
                this.isMPhilOrPhdShow = true;
                this.isFellowshipShow = false;
                break;
        }
    }

    //Pagination Page Change onChangeClick
    onChangePage(event: PageEvent) {
        this.pageSize = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getAllProfileMarks();
    }

    getResearchCategoryById(id, index) {
        this._researchCategoryTypeService
            .getAllActiveListById(id)
            .subscribe((res) => {
                this.dataSet[index].researchCategory = res.obj.categoryName;
            });
    }
    save(actionType) {
        if (this.frmGroup.valid) {
            if (actionType === 'Save') {
                this._profileMarksSetupService
                    .saveData(this.frmGroup.value)
                    .subscribe(
                        (res) => {
                            this.toastr.success('Save Successfully');
                            this.getAllProfileMarks();
                        },
                        (err) => {
                            this.toastr.error('Save unsuccessfully');
                            console.log(err);
                        }
                    );
            } else {
                this._profileMarksSetupService
                    .updateData(this.frmGroup.value)
                    .subscribe(
                        (res) => {
                            this.toastr.success('Update Successfully');
                            this.getAllProfileMarks();
                        },
                        (err) => {
                            this.toastr.error('Update unsuccessfully');
                            console.log(err);
                        }
                    );
            }
            this.formReset();
        }
    }

    editRow(uuid) {
        this._profileMarksSetupService.getDataByUuid(uuid).subscribe(
            (res) => {
                if (res.success) {
                    const researchCategory =
                        this.researchCategoryTypeList.filter(
                            (researchRes) =>
                                researchRes.id == res.obj.researchCategory
                        );
                    if (researchCategory.length === 0) {
                        this.toastr.error('Its inactive now', 'Unauthorized');
                    } else {
                        this.buttonText = 'Edit';
                        this.frmGroup.reset();
                        if(res.obj.researchCategory==2 || res.obj.researchCategory==3){
                          this.isMPhilOrPhdShow = false;
                        }
                        res.obj.researchCategory = Number(res.obj.researchCategory)
                        this.onSelectedCategory(res.obj.researchCategory);
                        this.frmGroup.patchValue(res.obj);
                        // this.frmGroup.patchValue({
                        //     uuid: res.obj.uuid,
                        //     researchCategory: Number(res.obj.researchCategory),
                        //     govEmployee: res.obj.govEmployee,
                        //     applicantAge: res.obj.applicantAge,
                        //     marksOnProfession: res.obj.marksOnProfession,
                        //     marksOnSubjectRelevancy:
                        //         res.obj.marksOnSubjectRelevancy,
                        //     firstDivision: res.obj.firstDivision,
                        //     secDivision: res.obj.secDivision,
                        //     thirdDivision: res.obj.thirdDivision,
                        //     postGraduateResultMarksFirst:
                        //         res.obj.postGraduateResultMarksFirst,
                        //     postGraduateResultMarksSec:
                        //         res.obj.postGraduateResultMarksSec,
                        //     postGraduateResultMarksThird:
                        //         res.obj.postGraduateResultMarksThird,
                        //     mphil: res.obj.mphil,
                        //     phd: res.obj.phd,
                        //     organizationStructure:
                        //         res.obj.organizationStructure,
                        //     thesisGroup: res.obj.thesisGroup,
                        //     nonThesis: res.obj.nonThesis,
                        //     marksIfPublishedInJournal:
                        //         res.obj.marksIfPublishedInJournal,
                        //     marksIfTrainedOnResearch:
                        //         res.obj.marksIfTrainedOnResearch,
                        //     publishedJournalQtyLocal:
                        //         res.obj.publishedJournalQtyLocal,
                        //     publishedJournalQtyIntl:
                        //         res.obj.publishedJournalQtyIntl,
                        //     experienceYearsInResearchWork:
                        //         res.obj.experienceYearsInResearchWork,
                        // });
                    }
                }
            },
            (error) => {}
        );
    }

    openDeleteDialog(message: string, uuid) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = { message: ConfirmDialogConstant.MESSAGE };
        const dialogRef = this.dialog.open(
            SubmitConfirmationDialogComponent,
            dialogConfig
        );

        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            if (res) {
                this._profileMarksSetupService.deleteDataById(uuid).subscribe(
                    (res) => {
                        this.toastr.success('Delete Successfully');
                        this.getAllProfileMarks();
                    },
                    (err) => {
                        this.toastr.error('Delete unsuccessfully');
                        console.log(err);
                    }
                );
            }
            dialogRef.close(true);
        });
    }

    getAllProfileMarks() {
        this.dataSet = [];

        this._profileMarksSetupService
            .getListData(this.page, this.pageSize)
            .subscribe(
                (res) => {
                    if (res.success) {
                        this.totalElements = res.page
                            ? res.page.totalElements
                            : 0;
                        res.page.content.forEach((item, index) => {
                          
                            this.dataSet.push({
                                id: item.id,
                                uuid: item.uuid,
                                researchCategory: item.researchCategory,
                                govEmployee: item.govEmployee,
                                applicantAge: item.applicantAge,
                                marksOnProfession: item.marksOnProfession,
                                marksOnSubjectRelevancy:
                                    item.marksOnSubjectRelevancy,
                                firstDivision: item.firstDivision,
                                secDivision: item.secDivision,
                                thirdDivision: item.thirdDivision,
                                postGraduateResultMarksFirst:
                                    item.postGraduateResultMarksFirst,
                                postGraduateResultMarksSec:
                                    item.postGraduateResultMarksSec,
                                postGraduateResultMarksThird:
                                    item.postGraduateResultMarksThird,
                                mphil: item.mphil,
                                phd: item.phd,
                                organizationStructure:
                                    item.organizationStructure,
                                thesisGroup: item.thesisGroup,
                                nonThesis: item.nonThesis,
                                marksIfPublishedInJournal:
                                    item.marksIfPublishedInJournal,
                                marksIfTrainedOnResearch:
                                    item.marksIfTrainedOnResearch,
                                publishedJournalQtyLocal:
                                    item.publishedJournalQtyLocal,
                                publishedJournalQtyIntl:
                                    item.publishedJournalQtyIntl,
                                experienceYearsInResearchWork:
                                    item.experienceYearsInResearchWork,
                            });
                            
                            this.getResearchCategoryById(
                                item.researchCategory,
                                index
                            );
                        });
                        this.dataSource = new MatTableDataSource(this.dataSet);
                        this.spinner = false;
                    }
                },
                (error) => {}
            );
    }

    // search data by filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    formReset() {
        this.buttonText = 'Save';
        this.frmGroup.reset();
        this.frmGroup.patchValue({
          govEmployee: 0,
          applicantAge: 0,
        })
    }

    getResearchCategoryTypeList() {
      this._researchCategoryTypeService.getAllActiveList().subscribe(
        (res) => {
          this.researchCategoryTypeList = res.items ? res.items : [];
          console.log('researchCategoryTypeList ========> ', this.researchCategoryTypeList);
          
        }
      );
    }
}
