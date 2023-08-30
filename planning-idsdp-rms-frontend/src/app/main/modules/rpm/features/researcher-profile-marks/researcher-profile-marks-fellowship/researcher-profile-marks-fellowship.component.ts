import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from "@angular/router";
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { ConfirmDialogComponent } from 'app/main/shared/components/confirm-dialog/confirm-dialog.component';
import { SnackbarHelper } from "../../../../../core/helper/snackbar.helper";
import { UnsubscribeAdapterComponent } from "../../../../../core/helper/unsubscribeAdapter";
import { StorageService } from "../../../../../core/services/storage/storage.service";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { ProfileMarksSetupService } from "../../../../settings/services/ProfileMarksSetupService";
import { downloadIcon, previousIcon, printIcon, saveIcon } from '../../../constants/button.constants';
import { EducationDegree, EducationDivisionType, PublicationType } from "../../../enums/enum-list.enum";
import { ResearcherProfileMarks } from "../../../models/ResearcherProfileMarks";
import { ResearcherProposal } from "../../../models/ResearcherProposal";
import { JasperServiceService } from "../../../services/jasper-service.service";
import { ResearchProfileMultiFormService } from "../../../services/research-profile-multi-form.service";
import { ResearcherListService } from "../../../services/researcher-list.service";
import { ResearcherProfileMarksService } from "../../../services/researcher-profile-marks.service";
import { ResearcherProposalService } from "../../../services/researcher-proposal.service";
import { locale as lngBangla } from "./i18n/bn";
import { locale as lngEnglish } from "./i18n/en";
@Component({
    selector: 'app-researcher-profile-marks-fellowship',
    templateUrl: './researcher-profile-marks-fellowship.component.html',
    styleUrls: ['./researcher-profile-marks-fellowship.component.scss']
})
export class ResearcherProfileMarksFellowshipComponent extends UnsubscribeAdapterComponent implements OnInit {

    userDetails:any;
    save_button = true;
    spinner = true;
    proposalUuid: string;
    proposal: ResearcherProposal;
    profile: any;
    marks: ResearcherProfileMarks = new ResearcherProfileMarks();
    category: any;
    saveIcon = saveIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    previousIcon = previousIcon;
    total: number;
    totalQualification: number = 0;
    totalExperience: number = 0;
    saveDisable = true;
    // graduationType = PromotionalGraduationType;
    graduationType = [];
    spinner2:boolean=false;
    langVal:string;

    circularData:any;

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
                private service: ResearcherProfileMarksService,
                private proposalService: ResearcherProposalService,
                private profileMarksSetupService: ProfileMarksSetupService,
                private researchProfileMultiFormService: ResearchProfileMultiFormService,
                private researcherListService: ResearcherListService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private snackbarHelper: SnackbarHelper,
                private jasperService:JasperServiceService,
                private storageService: StorageService,
                private matDialog: MatDialog,
                private dataCom: DataComService,
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
        this.userDetails = this.storageService.getUserData();
        this.activatedRoute.params.subscribe(params => {
            this.proposalUuid = params['uuid'];
            this.getResearcherProposalByUuId();
        });
        this.getDivision();
    }

    getDivision() {
        this.spinner = true;
        this.subscribe$.add(
            this.researchProfileMultiFormService.getDivisions().subscribe(res => {
                this.graduationType = res;
                this.spinner = false;
            })
        );
    }

    getResearcherProposalByUuId() {
        this.spinner = true;
        this.subscribe$.add(
            this.proposalService.getByUuid(this.proposalUuid).subscribe(
                response => {
                    if (response.success) {
                        this.proposal = response.obj;
                        this.marks.researcherProposalId = response.obj.id;
                        
                        let fiscalYearId = response?.obj?.fiscalYear?.id;
                        if(fiscalYearId > 0){
                            this.proposalService.getActiveCircularData(fiscalYearId).subscribe((res) => {
                                if (res.success) {
                                    this.circularData = (res?.items?.length > 0) ? res?.items[0] : '';
                                }
                            });
                        }

                        this.getResearcherProfileByIdAndCategory();
                    }
                    this.spinner = false;
                },
                _ => {
                    this.spinner = false;
                }
            )
        );
    }

    getResearcherProfileByIdAndCategory() {
        this.spinner = true;
        this.subscribe$.add(
            this.service.getResearcherProfileByIdAndCategory(this.proposal.id, this.proposal.stResearchCatTypeId).subscribe(
                response => {
                    if (response.success) {
                        if (response.obj) {
                            this.save_button = false;
                            this.marks = response.obj;
                            this.countTotalQualificationMarks();
                            this.countTotalExperienceMarks();
                            this.checkedFormValidation();
                        } else {
                            this.getProfileMarksSetup();
                            this.getProfileInfo();
                        }
                    }
                    this.spinner = false;
                },
                _ => {
                    this.spinner = false;
                }
            )
        );
    }

    getProfileMarksSetup() {
        this.spinner = true;
        this.subscribe$.add(
            this.profileMarksSetupService.getProfileMarksSetupDataByResearchCategoryId(this.proposal.stResearchCatTypeId).subscribe(
                response => {
                    if (response.success) {
                        if (response.obj) {
                            this.category = response.obj;
                            // this.setMark();
                        }
                    }
                    this.spinner = false;
                },
                _ => {
                    this.spinner = false;
                }
            )
        );
    }

    private setMark() {

        // --------------For Post Graduation---------------
        const pg = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.POST_GRADUATE)[0];
        let realPostGraduation = '';
        /*---------divisionClassOrCgpa = 1 is division Result, otherwise CGPA Result----------*/        
        if(pg?.divisionClassOrCgpa == 1)
        {
            realPostGraduation = pg?.division ? pg.division : 0;
        }
        else{
            realPostGraduation = pg?.cgpa ? pg.cgpa : 0;
        }
        this.marks.realPostGraduation = realPostGraduation;
        
        // --------------For MPhil---------------
        const mphil = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.MPHIL)[0];
        this.marks.realMphil = mphil?.division ? mphil?.division : mphil?.cgpa;

        // --------------For PHD---------------
        const phd = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.PHD)[0];
        this.marks.realPhd = phd?.division ? phd?.division : phd?.cgpa;

        this.marks.realProfession = this.profile.researcherProfilePersonalInfoMaster.occupation;
        this.marks.professionMarks = this.profile.professionalExperienceList.length>0?this.category.marksOnProfession:0;
        this.marks.subjectRelevancyMarks = 0;//this.category.marksOnSubjectRelevancy;

        let localPublication = this.profile.publicationInfoList.filter(f => f.publishedIn === PublicationType.NATIONAL);
        
        var localPublicationMarks_Val = this.marks.realLocalPublication = (this.profile.publicationInfoList.length > 0) ?  localPublication?.length: 0;

        if(localPublicationMarks_Val > 0 && localPublicationMarks_Val <= 5 )
        {
            this.marks.localPublicationMarks = this.category?.localPublication1 ? this.category.localPublication1 : 0;
        }
        if(localPublicationMarks_Val > 6 && localPublicationMarks_Val <= 10 )
        {
            this.marks.localPublicationMarks = this.category?.localPublication2 ? this.category.localPublication2 : 0;
        }
        if(localPublicationMarks_Val > 10 )
        {
            this.marks.localPublicationMarks = this.category?.localPublication3 ? this.category.localPublication3 : 0;
        }

        let intPublication = this.profile.publicationInfoList.filter(f => f.publishedIn === PublicationType.INTERNATIONAL);
        var internalPublicationMarks = this.marks.realInternalPublication = (this.profile.publicationInfoList.length > 0) ? intPublication?.length : 0;

        if(internalPublicationMarks > 0 && internalPublicationMarks <= 5 )
        {
            this.marks.internalPublicationMarks = this.category?.interPublication1 ? this.category.interPublication1 : 0;
        }
        if(internalPublicationMarks > 6 && internalPublicationMarks <= 10 )
        {
            this.marks.internalPublicationMarks = this.category?.interPublication2 ? this.category.interPublication2 : 0;
        }
        if(internalPublicationMarks > 10 )
        {
            this.marks.internalPublicationMarks = this.category?.interPublication3 ? this.category.interPublication3 : 0;
        }

        this.marks.realResearchTraining = this.profile.profileTrainingList.length;

        this.marks.researchTrainingMarks = this.profile.profileTrainingList.length>0?this.category.experienceYearsInResearchWork:0;
       

        var sumVal = 0;
        this.profile.researchExperienceList.forEach((v=>{
            sumVal += Number(v.totalResearchExp) + 0;
        }))
        this.marks.realResearchWork = sumVal;

        if(sumVal > 0 && sumVal < 8)
        {
            this.marks.researchWorkMarks = this.category?.researchExperience1 ?  this.category.researchExperience1 : 0;
        }
        if(sumVal == 8){
            this.marks.researchWorkMarks = this.category?.researchExperience2 ?  this.category.researchExperience2 : 0;
        }
        if(sumVal > 8){
            this.marks.researchWorkMarks = this.category?.researchExperience3 ?  this.category.researchExperience3 : 0;
        }

        /*---------divisionClassOrCgpa = 1 is division Result, otherwise CGPA Result----------*/       
        if(phd){
            this.marks.phdMarks = this.category.phd;
            this.marks.mphilMarks = 0;
            this.marks.postGraduationMarks = 0;
        }else if(mphil && !phd ){
            this.marks.phdMarks = 0;
            this.marks.mphilMarks = this.category.mphil;
            this.marks.postGraduationMarks = 0;
        }else if(pg && !mphil && !phd){

            if(pg?.divisionClassOrCgpa == 1){
                this.marks.postGraduationMarks =
                pg?.division == EducationDivisionType.FIRST_DIVISION
                    ? this.category.postGraduateResultMarksFirst
                    : pg?.division == EducationDivisionType.SECOND_DIVISION
                    ? this.category.postGraduateResultMarksSec
                    : pg?.division == EducationDivisionType.THIRD_DIVISION
                    ? this.category.postGraduateResultMarksThird
                    : 0;
            }
            else{
                // ----------For CGPA Result--------
                if(pg?.cgpa >= 3.5)
                {
                    this.marks.postGraduationMarks = this.category?.postGraduateCgpaFirst ? this.category.postGraduateCgpaFirst : 0;
                }
                if(pg?.cgpa >= 2.5 && pg?.cgpa < 3.5)
                {
                    this.marks.postGraduationMarks = this.category?.postGraduateCgpaSecond ? this.category.postGraduateCgpaSecond : 0;
                }
                if(pg?.cgpa < 2.5)
                {
                    this.marks.postGraduationMarks = this.category?.postGraduateCgpaThird ? this.category.postGraduateCgpaThird : 0;
                }
            }
            
            this.marks.phdMarks = 0;
            this.marks.mphilMarks = 0;
        }

        this.countTotalQualificationMarks();
        this.countTotalExperienceMarks();
        this.checkedFormValidation();
    }


    private setRealInfo() {
        console.log('this.profile');
        if (this.profile.educationInfoList.length > 0) {
            // --------------For Post Graduation---------------
            const pg = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.POST_GRADUATE)[0];
            this.marks.realPostGraduation = pg?.division ? pg.division : pg.cgpa;
            
            // --------------For MPhil---------------
            const mphil = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.MPHIL)[0];
            this.marks.realMphil = mphil?.division ? mphil?.division : mphil?.cgpa;

            // --------------For PHD---------------
            const phd = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.PHD)[0];
            this.marks.realPhd = phd?.division ? phd?.division : phd?.cgpa;
        }

        this.marks.realProfession = this.profile.researcherProfilePersonalInfoMaster.occupation;

        this.profile.researchExperienceList.forEach((v=>{
            console.log("v.totalResearchExp; ===", v.totalResearchExp);
            this.marks.realResearchWork = Number(this.marks.realResearchWork) + Number(v.totalResearchExp) + 0;
        }))

        //this.marks.realResearchWork = this.profile.researchExperienceList.length;
        this.marks.realLocalPublication = (this.profile.publicationInfoList.length > 0) ? this.profile.publicationInfoList.filter(f => f.publishedIn === PublicationType.NATIONAL).length : 0;
        this.marks.realInternalPublication = (this.profile.publicationInfoList.length > 0) ? this.profile.publicationInfoList.filter(f => f.publishedIn === PublicationType.INTERNATIONAL).length : 0;
        this.marks.realResearchTraining = this.profile.profileTrainingList.length;

        this.checkedFormValidation();
    }


    getProfileInfo() {
        this.spinner = true;
        this.subscribe$.add(
            this.researcherListService.researcherProfileDateById(this.proposal.resProfilePersonalInfoId).subscribe(
                response => {
                    if (response.success) {
                        if (response.model) {
                            this.profile = response.model;
                           // this.setRealInfo();
                            this.setMark();
                        }
                    }
                    this.spinner = false;
                },
                _ => {
                    this.spinner = false;
                }
            )
        );
    }

    changeGraduation() {
        // this.marks.postGraduationMarks = this.graduationType.find(f => f.value === this.marks.postGraduationType).mark;
    }

    checkedFormValidation() {
        this.saveDisable = false;
    }

    countTotalQualificationMarks() {
        this.totalQualification = 0;
        if (this.marks.professionMarks) {
            this.totalQualification += this.marks.professionMarks;
        }
        if (this.marks.subjectRelevancyMarks) {
            this.totalQualification += this.marks.subjectRelevancyMarks;
        }
        if (this.marks.postGraduationMarks) {
            this.totalQualification += this.marks.postGraduationMarks;
        }
        if (this.marks.mphilMarks) {
            this.totalQualification += this.marks.mphilMarks;
        }
        if (this.marks.phdMarks) {
            this.totalQualification += this.marks.phdMarks;
        }
        this.total = this.totalExperience + this.totalQualification;
        this.marks.totalMarks = this.totalExperience + this.totalQualification;
    }

    countTotalExperienceMarks() {
        this.totalExperience = 0;
        if (this.marks.researchWorkMarks) {
            this.totalExperience += this.marks.researchWorkMarks;
        }
        if (this.marks.localPublicationMarks) {
            this.totalExperience += this.marks.localPublicationMarks;
        }
        if (this.marks.internalPublicationMarks) {
            this.totalExperience += this.marks.internalPublicationMarks;
        }
        if (this.marks.researchTrainingMarks) {
            this.totalExperience += this.marks.researchTrainingMarks;
        }
        this.total = this.totalExperience + this.totalQualification;
        this.marks.totalMarks = this.totalExperience + this.totalQualification;
    }

    private openConfirmationModal(callback) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {showModal:true};
        const dialogRef = this.matDialog.open(ConfirmDialogComponent,dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe((res) => {
            if (res) {
                dialogRef.close(true);
                callback(res);
            }
        });
    }

    onSubmit() {
        this.openConfirmationModal(res => {
            if(res){
                this.spinner = true;
                this.saveDisable = true;
                this.marks.stResearchCatTypeId = this.proposal.stResearchCatTypeId;
                this.marks.uuid ? this.update() : this.create();
            }
        });         
    }

    private create() {
        this.subscribe$.add(
            this.service.create(this.marks).subscribe(res => {
                if (res.success) {
                    this.save_button = false;
                    this.snackbarHelper.openSuccessSnackBar();
                    this.marks = res.obj;
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.spinner = false;
                this.saveDisable = false;
            }, _ => {

                this.spinner = false;
                this.saveDisable = false;
            })
        );
    }

    private update() {
        this.subscribe$.add(
            this.service.update(this.marks).subscribe(res => {
                if (res.success) {
                    this.snackbarHelper.openSuccessSnackBar();
                    this.marks = res.obj;
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.spinner = false;
                this.saveDisable = false;
            }, _ => {

                this.spinner = false;
                this.saveDisable = false;
            })
        );
    }

    previousTab() {
        this.router.navigate(['/researcher/list']);
    }

    goToProfileView() {
         //window.open('researcher/profile/' + uuid);
         let uuid = this.proposal?.researcherProfilePersonalInfoMaster?.uuid;
         let isInstitutional = this.proposal?.researcherProfilePersonalInfoMaster?.isInstitutional;
         window.open(`rsearcher-profile-information/${uuid}/${isInstitutional}/view`);
    }

    download() {
        let lang = localStorage.getItem("currentLang");
        this.genPdf(this.proposalUuid, lang)

    }


    genPdf(uuid, lang) {
        this.spinner2 = true;
        this.jasperService.generateProfileMarksInstitutionalPdf(uuid, lang,"fellowship").subscribe((response) => {
            this.spinner2 = false;
            let file = new Blob([response], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, error => {
            this.spinner2 = false;
        })

    }
}


// researchCategory;
//
// govEmployee;
//
// applicantAge;
//
// marksOnProfession;
//
// marksOnSubjectRelevancy;
//
// firstDivision;
//
// secDivision;
//
// thirdDivision;
//
// postGraduateResultMarksFirst;
//
// postGraduateResultMarksSec;
//
// postGraduateResultMarksThird;
//
// mphil;
//
// phd;
//
// organizationStructure;
//
// organizationActivity;
//
// thesisGroup;
//
// nonThesis;
//
// marksIfPublishedInJournal;
//
// marksIfTrainedOnResearch;
//
// publishedJournalQtyLocal;
//
// publishedJournalQtyIntl;
//
// experienceYearsInResearchWork;
//
// // new
// graduateCgps4;
// graduateCgps35To39;
// graduateCgpsBelow35;
//
// postGraduateCgps4;
// postGraduateCgps35To39;
// postGraduateCgpsBelow35;
//
// journalPublicationLocOneToFive;
// journalPublicationLocSixToTen;
// journalPublicationLocTenPlus;
//
// journalPublicationIntOneToFive;
// journalPublicationIntSixToTen;
// journalPublicationIntTenPlus;
//
// researchExperienceOneToSeven;
// researchExperienceEight;
// researchExperienceEightPlus;
