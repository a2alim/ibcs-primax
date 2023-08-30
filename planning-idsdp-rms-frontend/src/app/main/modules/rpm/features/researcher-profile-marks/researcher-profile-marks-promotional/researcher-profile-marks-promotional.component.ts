import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from 'app/main/core/services/api/api.service';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { ConfirmDialogComponent } from 'app/main/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogConstant } from 'app/main/shared/constant/confirm.dialog.constant';
import { environment,reportBackend } from 'environments/environment';
import { ToastrService } from "ngx-toastr";
import { SnackbarHelper } from "../../../../../core/helper/snackbar.helper";
import { UnsubscribeAdapterComponent } from "../../../../../core/helper/unsubscribeAdapter";
import { StorageService } from "../../../../../core/services/storage/storage.service";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { ProfileMarksSetupService } from "../../../../settings/services/ProfileMarksSetupService";
import { downloadIcon, previousIcon, printIcon, saveIcon } from '../../../constants/button.constants';
import { EducationDegree, EducationDivisionType } from "../../../enums/enum-list.enum";
import { ResearcherProfileMarks } from "../../../models/ResearcherProfileMarks";
import { ResearcherProposal } from "../../../models/ResearcherProposal";
import { JasperServiceService } from "../../../services/jasper-service.service";
import { ResearchProfileMultiFormService } from "../../../services/research-profile-multi-form.service";
import { ResearcherListService } from "../../../services/researcher-list.service";
import { ResearcherProfileMarksService } from "../../../services/researcher-profile-marks.service";
import { ResearcherProposalService } from "../../../services/researcher-proposal.service";
import { locale as lngBangla } from "./i18n/bn";
import { locale as lngEnglish } from "./i18n/en";
import * as bl2Js from 'bl2-js-report';
@Component({
    selector: 'app-researcher-profile-marks-promotional',
    templateUrl: './researcher-profile-marks-promotional.component.html',
    styleUrls: ['./researcher-profile-marks-promotional.component.scss']
})
export class ResearcherProfileMarksPromotionalComponent extends UnsubscribeAdapterComponent implements OnInit {

    spinner = true;
    proposalUuid: string;
    proposal: ResearcherProposal;
    profile: any = {};
    marks: ResearcherProfileMarks = new ResearcherProfileMarks();
    category: any;
    saveIcon = saveIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    previousIcon = previousIcon;
    total: number = 0;
    totalQualification: number = 0;
    totalExperience: number = 0;
    disableSave = true;
    graduationType = [];
    spinner2:boolean=false;

    userDetails:any;
    save_button = true;
    profileInfo:any;
    langVal:string;

    circularData:any;

    dataPDF:any ={};

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private service: ResearcherProfileMarksService,
        private proposalService: ResearcherProposalService,
        private profileMarksSetupService: ProfileMarksSetupService,
        private researchProfileMultiFormService: ResearchProfileMultiFormService,
        private researcherListService: ResearcherListService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private snackbarHelper: SnackbarHelper,
        private  jasperService:JasperServiceService,
        private storageService: StorageService,
        private toastr: ToastrService,
        private matDialog: MatDialog,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private dataCom: DataComService,
        private api: ApiService,
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
        // alert('dddddddddddddddddddd');
        this.userDetails = this.storageService.getUserData();
        this.activatedRoute.params.subscribe(params => {
            let profileUuid = params['profileUuid'];
            this.proposalUuid = params['uuid'];
            this.getResearcherProposalByUuId();
            
            if(profileUuid != ""){
                this.getResearchersProfileInfo(profileUuid);
            }
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

        if (this.profile.educationInfoList.length > 0) {

            /*---------------For Graduation --------------*/
            const g = this.profile.educationInfoList.find(
                (f) => f.certificationName === EducationDegree.GRADUATE
            );
            
            if(g?.divisionClassOrCgpa == 1)
            {
                this.marks.realGraduation = this.marks.graduationType = g?.division ? g?.division : "";                
                this.marks.graduationMarks =
                    g?.division == EducationDivisionType.FIRST_DIVISION
                        ? this.category.firstDivision
                        : g?.division == EducationDivisionType.SECOND_DIVISION
                            ? this.category.secDivision
                            : g?.division == EducationDivisionType.THIRD_DIVISION
                                ? this.category.thirdDivision
                                : 0;
            }
            else
            {
                this.marks.realGraduation = this.marks.graduationType = g?.cgpa ? g.cgpa : 0;
                if(g?.cgpa >= 3.5)
                {
                    this.marks.graduationMarks = this.category?.graduateCgpaFirst ? this.category.graduateCgpaFirst : 0;
                }
                if(g?.cgpa >= 2.5 && g?.cgpa < 3.5)
                {
                    this.marks.graduationMarks = this.category?.graduateCgpaSecond ? this.category.graduateCgpaSecond : 0;
                }
                if(g?.cgpa < 2.5)
                {
                    this.marks.graduationMarks = this.category?.graduateCgpaThird ? this.category.graduateCgpaThird : 0;
                }
            }
            /*---------------/For Graduation --------------*/

            /*---------------For Post Graduation --------------*/
            const pg = this.profile.educationInfoList.find(
                (f) => f.certificationName === EducationDegree.POST_GRADUATE
            );

            if(pg?.divisionClassOrCgpa == 1)
            {
                this.marks.postGraduationType = this.marks.realPostGraduation = pg?.division ? pg.division : 0;
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
                this.marks.postGraduationType = this.marks.realPostGraduation = pg?.cgpa ? pg.cgpa : 0;
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
            /*---------------/For Post Graduation --------------*/

            const mphil = this.profile.educationInfoList.find(f => f.certificationName === EducationDegree.MPHIL);
            const mphilMarks = mphil?.division ? mphil?.division : mphil?.cgpa;

            const phd = this.profile.educationInfoList.find(f => f.certificationName === EducationDegree.PHD);
            const phdMarks = phd?.division ? phd?.division : mphil?.cgpa;

            this.marks.realMphilPhd = (mphilMarks ? ('Mphil-' + mphilMarks) : '') + (phdMarks ? (' PHD-' + phdMarks) : '');
            this.marks.mphilPhdMarks = mphil || phd ? this.category.phd || this.category.mphil : 0;

            if(pg?.thesisGroup == 1)
            {
                this.marks.realNonThesis = 'No';
                this.marks.nonThesisMarks = 0;

                this.marks.realThesis = "Yes";
                this.marks.thesisMarks = pg?.thesisGroup || mphil?.thesisGroup || phd?.thesisGroup ? this.category.thesisGroup : 0;
            }
            else
            {
                this.marks.realThesis = 'No';
                this.marks.thesisMarks = 0;

                this.marks.realNonThesis = "Yes";
                this.marks.nonThesisMarks = !pg?.thesisGroup || !mphil?.thesisGroup || !phd?.thesisGroup ? this.category.nonThesis : 0;
            }
            
        }
        this.marks.realAgeGovtEmployee = this.profile.researcherProfilePersonalInfoMaster.age;
        this.marks.applicantAgeGovtEmployeeMarks = Number(this.marks.realAgeGovtEmployee) < 40 || this.marks.isGovEmployee ? 3 : 0;
        this.marks.realProfession = this.profile.researcherProfilePersonalInfoMaster.occupation;
        this.marks.professionMarks = this.profile.professionalExperienceList.length > 0 ? this.category.marksOnProfession : 0;
        this.marks.realResearchWork = this.profile.researchExperienceList.length;
        this.marks.subjectRelevancyMarks = 0;//this.category.marksOnSubjectRelevancy;
        // this.marks.realThesisGroup=null;
        // this.marks.thesisGroupMarks = 0;//this.category.thesisGroup;
        this.marks.realResearchTraining = this.profile.profileTrainingList.length;
        this.marks.researchTrainingMarks = this.profile.profileTrainingList.length > 0 ? this.category.marksIfTrainedOnResearch : 0;
        this.marks.realPublication = (this.profile.publicationInfoList.length > 0) ? this.profile.publicationInfoList.length : 0;
        this.marks.publicationMarks = this.profile.publicationInfoList.length > 0 ? this.category.marksIfPublishedInJournal : 0;
        this.marks.isGovEmployee = this.profile.researcherProfilePersonalInfoMaster.isGovEmployee;
        this.countTotalQualificationMarks();
        this.countTotalExperienceMarks();
        this.checkedFormValidation();
        // this.marks.applicantAgeGovtEmployeeMarks = this.category.applicantAge;
        // this.marks.graduationType = this.category.firstDivision ? EducationDivisionType.FIRST_DIVISION : this.category.secDivision ? EducationDivisionType.SECOND_DIVISION : this.category.thirdDivision ? EducationDivisionType.THIRD_DIVISION : EducationDivisionType.CGPA;
        // this.marks.graduationMarks = this.category.firstDivision ? this.category.firstDivision : this.category.secDivision ? this.category.secDivision : this.category.thirdDivision;
        // this.marks.postGraduationMarks = this.category.postGraduateResultMarksFirst ? this.category.postGraduateResultMarksFirst : this.category.postGraduateResultMarksSec ? this.category.postGraduateResultMarksSec : this.category.postGraduateResultMarksThird;
        // this.marks.postGraduationType = this.category.postGraduateResultMarksFirst ? EducationDivisionType.FIRST_DIVISION : this.category.postGraduateResultMarksSec ? EducationDivisionType.SECOND_DIVISION : this.category.postGraduateResultMarksThird ? EducationDivisionType.THIRD_DIVISION : EducationDivisionType.CGPA;
    }

    private setRealInfo() {
        // if (this.profile.educationInfoList.length > 0) {
        //     const g = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.GRADUATE)[0];
        //     this.marks.realGraduation = g?.division ? g?.division : g?.cgpa;
        //     const pg = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.POST_GRADUATE)[0];
        //     this.marks.realPostGraduation = pg?.division ? pg?.division : pg?.cgpa;
        //     const mphil = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.MPHIL)[0];
        //     const phd = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.PHD)[0];
        //     const mphilMarks = mphil?.division ? mphil?.division : mphil?.cgpa;
        //     const phdMarks = phd?.division ? phd?.division : mphil?.cgpa;
        //     this.marks.realMphilPhd = (mphilMarks ? ('Mphil-' + mphilMarks) : '') + (phdMarks ? (' PHD-' + phdMarks) : '');
        // }
        // this.marks.realAgeGovtEmployee = this.profile.researcherProfilePersonalInfoMaster.age;
        // this.marks.realProfession = this.profile.researcherProfilePersonalInfoMaster.occupation;
        // this.marks.realResearchWork = this.profile.researchExperienceList.length;
        // this.marks.realPublication = (this.profile.publicationInfoList.length > 0) ? this.profile.publicationInfoList.length : 0;
        // this.marks.realResearchTraining = this.profile.profileTrainingList.length;
        // this.marks.isGovEmployee = this.profile.researcherProfilePersonalInfoMaster.isGovEmployee;
        // this.setMark();
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
                            this.setRealInfo();
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

    checkedFormValidation() {
        // this.saveDisable = !(this.marks.applicantAgeGovtEmployeeMarks && (this.marks.realAgeGovtEmployee || Number(this.marks.realAgeGovtEmployee) >= 0) &&
        //     this.marks.professionMarks && (this.marks.realProfession || Number(this.marks.realProfession) >= 0) &&
        //     this.marks.subjectRelevancyMarks && (this.marks.realSubjectRelevancy || Number(this.marks.realSubjectRelevancy) >= 0) &&
        //     this.marks.graduationMarks && this.marks.graduationType && (this.marks.realGraduation || Number(this.marks.realGraduation) >= 0) &&
        //     this.marks.postGraduationMarks && this.marks.postGraduationType && (this.marks.realPostGraduation || Number(this.marks.realPostGraduation) >= 0) &&
        //     this.marks.mphilPhdMarks && (this.marks.realMphilPhd || Number(this.marks.realMphilPhd) >= 0) &&
        //     this.marks.thesisGroupMarks && (this.marks.realThesisGroup || Number(this.marks.realThesisGroup) >= 0) &&
        //     this.marks.thesisMarks && (this.marks.realThesis || Number(this.marks.realThesis) >= 0) &&
        //     this.marks.nonThesisMarks && (this.marks.realNonThesis || Number(this.marks.realNonThesis) >= 0) &&
        //     this.marks.publicationMarks && (this.marks.realPublication || Number(this.marks.realPublication) >= 0) &&
        //     this.marks.researchTrainingMarks && (this.marks.realResearchTraining || Number(this.marks.realResearchTraining) >= 0));
    }

    countTotalQualificationMarks() {

        if(this.category?.marksOnSubjectRelevancy < this.marks?.subjectRelevancyMarks)
        {
            this.marks.subjectRelevancyMarks = 0;
            this.save_button = false;
            this.toastr.error("Enter Maximum "+this.category?.marksOnSubjectRelevancy+ " Number");
        }

        this.totalQualification = 0;
        if (this.marks.applicantAgeGovtEmployeeMarks) {
            this.totalQualification += this.marks.applicantAgeGovtEmployeeMarks;
        }
        if (this.marks.professionMarks) {
            this.totalQualification += this.marks.professionMarks;
        }
        if (this.marks.subjectRelevancyMarks) {
            this.totalQualification += this.marks.subjectRelevancyMarks;
        }
        if (this.marks.graduationMarks) {
            this.totalQualification += this.marks.graduationMarks;
        }
        if (this.marks.postGraduationMarks) {
            this.totalQualification += this.marks.postGraduationMarks;
        }
        if (this.marks.mphilPhdMarks) {
            this.totalQualification += this.marks.mphilPhdMarks;
        }
        this.total = this.totalExperience + this.totalQualification;
        this.marks.totalMarks = this.totalExperience + this.totalQualification;
        //this.disableSave = (this.totalQualification > 20 && this.totalExperience > 30);
    }

    countTotalExperienceMarks() {
        this.totalExperience = 0;
        if (this.marks.thesisGroupMarks) {
            this.totalExperience += this.marks.thesisGroupMarks;
        }
        if (this.marks.thesisMarks) {
            this.totalExperience += this.marks.thesisMarks;
        }
        if (this.marks.nonThesisMarks) {
            this.totalExperience += this.marks.nonThesisMarks;
        }
        if (this.marks.publicationMarks) {
            this.totalExperience += this.marks.publicationMarks;
        }
        if (this.marks.researchTrainingMarks) {
            this.totalExperience += this.marks.researchTrainingMarks;
        }
        this.total = this.totalExperience + this.totalQualification;
        this.marks.totalMarks = this.totalExperience + this.totalQualification;
        //this.disableSave = (this.totalQualification > 20 && this.totalExperience > 30);
    
    }

    changeGraduation(type: string) {
        // if (type === 'g') {
        //     this.marks.graduationMarks = this.graduationType.find(f => f.value === this.marks.graduationType).mark;
        // } else if (type === 'pg') {
        //     this.marks.postGraduationMarks = this.graduationType.find(f => f.value === this.marks.postGraduationType).mark;
        // }
    }

/*---- For open popup dialog box----*/
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
        this.openConfirmationModal(res =>{
            if(res){
                this.spinner = true;
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
            })
        );
    }

    private update() {
        this.subscribe$.add(
            this.service.update(this.marks).subscribe(res => {
                if (res.success) {
                    this.save_button = false;
                    this.snackbarHelper.openSuccessSnackBar();
                    this.marks = res.obj;
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.spinner = false;
            })
        );
    }

    previousTab() {
        //this.openDialog();
        //return
        this.router.navigate(['/researcher/list']);
    }

    goToProfileView() {        
        console.log('proposal ==== >>>> ', this.proposal);
        let uuid = this.proposal?.researcherProfilePersonalInfoMaster?.uuid;
        let isInstitutional = this.proposal.researcherProfilePersonalInfoMaster.isInstitutional;
        window.open(`researcher-profile-information/${uuid}/${isInstitutional}/view`);
    }

    download() {
        let lang = localStorage.getItem("currentLang");
        this.genPdf(this.proposalUuid, lang)
    }

    genPdf(uuid, lang) {
        this.spinner2 = true;
        this.jasperService.generateProfileMarksInstitutionalPdf(uuid, lang,"promotional").subscribe((response) => {
            this.spinner2 = false;
            let file = new Blob([response], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, error => {
            this.spinner2 = false;
        })
    }

    getResearchersProfileInfo(profileUuid){
        this._researchProfileMultiFormService.profileView(profileUuid).subscribe(
            (data) => {
                this.profileInfo = data;
                let $this = this;
                data.educationInfos.forEach(val =>{
                    if(val.certificationName == 'Graduate')
                    {
                        $this.profileInfo.GraduateDoc = val.fileUploadModel.downloadUrl
                    }
                    if(val.certificationName == 'Post-Graduate')
                    {
                        $this.profileInfo.PostGraduateDoc = val.fileUploadModel.downloadUrl
                    }
                    if(val.certificationName == 'MPhil')
                    {
                        $this.profileInfo.MPhilDoc = val.fileUploadModel.downloadUrl
                    }
                })              
            },
            (error) => {
                this.spinner = false;
            }
        );
    }
    seeDocInformation(downloadUrl){
            console.log('111 = ',environment.ibcs.minioEndPointHost + downloadUrl);
            window.open(environment.ibcs.minioEndPointHost + downloadUrl, '_blank');
    }
    downloadPublicationDoc(publicationData:any){
        publicationData.forEach((publication) => {
            window.open(environment.ibcs.minioEndPointHost + publication?.fileUploadModel?.downloadUrl, '_blank');
        })
    }


    downloadPdf($fileName = '') {
        this.dataPDF['fileName'] = $fileName;
        this.dataPDF['templateName'] = 'rms-reports/profileMarksSetup';
        this.dataPDF['lng'] = localStorage.getItem("currentLang"); 
        // this.dataPDF['storeValForReport'] = JSON.stringify(this.storeValForReport);

        // this.data['downloadUrl'] = environment.ibcs.minioEndPointHost;
        console.log('this.data = ', );
        //Optional
        this.dataPDF['view'] = 0; // 0 = false or 1 = true
        this.dataPDF['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.dataPDF, actionUrl);
    }
}
