import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { ConfirmDialogComponent } from 'app/main/shared/components/confirm-dialog/confirm-dialog.component';
import { environment } from 'environments/environment';
import { ToastrService } from "ngx-toastr";
import { SnackbarHelper } from '../../../../../core/helper/snackbar.helper';
import { UnsubscribeAdapterComponent } from '../../../../../core/helper/unsubscribeAdapter';
import { StorageService } from "../../../../../core/services/storage/storage.service";
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';
import { ProfileMarksSetupService } from '../../../../settings/services/ProfileMarksSetupService';
import { downloadIcon, previousIcon, printIcon, saveIcon } from '../../../constants/button.constants';
import { EducationDegree, EducationDivisionType } from '../../../enums/enum-list.enum';
import { ResearcherProfileMarks } from '../../../models/ResearcherProfileMarks';
import { ResearcherProposal } from '../../../models/ResearcherProposal';
import { JasperServiceService } from "../../../services/jasper-service.service";
import { ResearchProfileMultiFormService } from '../../../services/research-profile-multi-form.service';
import { ResearcherListService } from '../../../services/researcher-list.service';
import { ResearcherProfileMarksService } from '../../../services/researcher-profile-marks.service';
import { ResearcherProposalService } from '../../../services/researcher-proposal.service';
import { locale as lngBangla } from './i18n/bn';
import { locale as lngEnglish } from './i18n/en';
@Component({
    selector: 'app-researcher-profile-marks-mPhill-phd',
    templateUrl: './researcher-profile-marks-mPhill-phd.component.html',
    styleUrls: ['./researcher-profile-marks-mPhill-phd.component.scss'],
})
export class ResearcherProfileMarksMPhillPhdComponent
    extends UnsubscribeAdapterComponent
    implements OnInit {
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
    graduationType = [];
    saveDisable = true;
    spinner2: boolean = false;
    userDetails:any;
    save_button = true;
    config: {
        timeOut: 5000;
        closeButton: true;
        positionClass: 'toast-top-right';
        enableHtml: true;
    };
    langVal:string;
    profileInfo:any;

    circularData:any;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private service: ResearcherProfileMarksService,
        private proposalService: ResearcherProposalService,
        private profileMarksSetupService: ProfileMarksSetupService,
        private researchProfileMultiFormService: ResearchProfileMultiFormService,
        private researcherListService: ResearcherListService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private snackbarHelper: SnackbarHelper,
        private jasperService: JasperServiceService,
        private storageService: StorageService,
        private toastr: ToastrService,
        private dataCom: DataComService,
        private matDialog: MatDialog,
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
    ) {
        super();
        this._fuseTranslationLoaderService.loadTranslations(
            lngEnglish,
            lngBangla
        );
        
        this.langVal = localStorage.getItem("currentLang")
        this.dataCom.getPassedItemData.subscribe(res => {
            if (res?.lang) {
                this.langVal = res?.lang ? res?.lang : '';
            }
        });
    }
    ngOnInit(): void {
        this.userDetails = this.storageService.getUserData();
        this.activatedRoute.params.subscribe((params) => {
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
            this.researchProfileMultiFormService
                .getDivisions()
                .subscribe((res) => {
                    this.graduationType = res;
                    this.spinner = false;
                })
        );
    }
    getResearcherProposalByUuId() {
        this.spinner = true;
        this.subscribe$.add(
            this.proposalService.getByUuid(this.proposalUuid).subscribe(
                (response) => {
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
                (_) => {
                    this.spinner = false;
                }
            )
        );
    }
    getResearcherProfileByIdAndCategory() {
        this.spinner = true;
        this.subscribe$.add(
            this.service.getResearcherProfileByIdAndCategory(
                    this.proposal.id,
                    this.proposal.stResearchCatTypeId
                )
                .subscribe(
                    (response) => {
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
                    (_) => {
                        this.spinner = false;
                    }
                )
        );
    }
    getProfileMarksSetup() {
        this.spinner = true;
        this.subscribe$.add(
            this.profileMarksSetupService.getProfileMarksSetupDataByResearchCategoryId(this.proposal.stResearchCatTypeId).subscribe((response) => {
                        if (response.success) {
                            if (response.obj) {
                                this.category = response.obj;
                                // this.setMark();
                            }
                        }
                        this.spinner = false;
                    },
                    (_) => {
                        this.spinner = false;
                    }
                )
        );
    }
    getProfileInfo() {
        this.spinner = true;
        this.subscribe$.add(
            this.researcherListService.researcherProfileDateById(this.proposal.resProfilePersonalInfoId).subscribe((response) => {
                        if (response.success) {
                            if (response.model) {
                                this.profile = response.model;
                                this.setRealInfoWiseMarks();
                            }
                        }
                        this.spinner = false;
                    },
                    (_) => {
                        this.spinner = false;
                    }
                )
        );
    }
    private setRealInfoWiseMarks() {
        console.log("this.profile.educationInfoList.length", this.profile.educationInfoList.length);
        console.log("this.profile.educationInfoList", this.profile.educationInfoList);
        if (this.profile.educationInfoList.length > 0) {
            //console.log('this.profile.educationInfoList = ', this.profile.educationInfoList);
            const g = this.profile.educationInfoList.find(
                (f) => f.certificationName === EducationDegree.GRADUATE
            );

            //console.log("g == ", g);

            //this.marks.realGraduation = g?.division ? g?.division : g?.cgpa;
            if(g?.divisionClassOrCgpa == 1)
            {
                this.marks.graduationType = g?.division;               
                this.marks.graduationMarks =
                    g?.division == EducationDivisionType.FIRST_DIVISION
                        ? this.category?.firstDivision
                        : g?.division == EducationDivisionType.SECOND_DIVISION
                            ? this.category?.secDivision
                            : g?.division == EducationDivisionType.THIRD_DIVISION
                                ? this.category?.thirdDivision
                                : 0;
            }
            else
            {
                this.marks.graduationType = g?.cgpa ? g.cgpa : 0;
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
            const pg = this.profile.educationInfoList.find((f) => f.certificationName === EducationDegree.POST_GRADUATE);

            //console.log("pg ==", pg);
        /*---------divisionClassOrCgpa = 1 is division Result, otherwise CGPA Result----------*/
            if(pg?.divisionClassOrCgpa == 1)
            {
                this.marks.postGraduationType = pg?.division ? pg.division : 0;
                this.marks.postGraduationMarks = pg?.division == EducationDivisionType.FIRST_DIVISION
                    ? this.category?.postGraduateResultMarksFirst
                    : pg?.division == EducationDivisionType.SECOND_DIVISION
                        ? this.category?.postGraduateResultMarksSec
                        : pg?.division == EducationDivisionType.THIRD_DIVISION
                            ? this.category?.postGraduateResultMarksThird
                            : 0;
            }
            else{
                this.marks.postGraduationType = pg?.cgpa ? pg.cgpa : 0;
                if(pg?.cgpa >= 3.5)
                {
                    this.marks.postGraduationMarks = this.category?.postGraduateCgpaFirst ? this.category?.postGraduateCgpaFirst : 0;
                }
                if(pg?.cgpa >= 2.5 && pg?.cgpa < 3.5)
                {
                    this.marks.postGraduationMarks = this.category?.postGraduateCgpaSecond ? this.category?.postGraduateCgpaSecond : 0;
                }
                if(pg?.cgpa < 2.5)
                {
                    this.marks.postGraduationMarks = this.category?.postGraduateCgpaThird ? this.category?.postGraduateCgpaThird : 0;
                }
            }
            this.marks.realThesis = (pg?.thesisGroup == 1) ? "Yes":'';
            this.marks.thesisMarks = pg?.thesisGroup ? this.category?.thesisGroup : 0;
            this.marks.realNonThesis = null;
            this.marks.nonThesisGroupMarks = !pg?.thesisGroup ? this.category?.nonThesis : 0;
        }
        this.marks.realEducationQualification =
            this.profile.educationInfoList?.length;
        this.marks.realPublication =
            this.profile.publicationInfoList.length > 0
                ? this.profile.publicationInfoList.length
                : 0;
        this.marks.educationQualificationMarks = this.category?.applicantAge;
        this.marks.professionMarks = this.category?.marksOnProfession;
        this.marks.publicationMarks =
            this.profile.publicationInfoList.length > 0
                ? this.category?.marksIfPublishedInJournal
                : 0;
        this.countTotalQualificationMarks();
        this.countTotalExperienceMarks();
        this.checkedFormValidation();
        // this.checkedFormValidation();
    }
    checkedFormValidation() {
        // this.saveDisable = !(this.marks.educationQualificationMarks && this.marks.realEducationQualification &&
        // this.marks.thesisMarks && this.marks.realThesis &&
        // this.marks.graduationMarks && this.marks.graduationType && this.marks.realGraduation &&
        // this.marks.thesisGroupMarks && this.marks.realThesisGroup &&
        // this.marks.postGraduationMarks && this.marks.postGraduationType && this.marks.realPostGraduation &&
        // this.marks.nonThesisGroupMarks && this.marks.realNonThesisGroup &&
        // this.marks.graduationRelatedToSociologyMarks && this.marks.realGraduationRelatedToSociology &&
        // this.marks.publicationMarks && this.marks.realPublication);
        if(this.marks.graduationRelatedToSociologyMarks>5){
            this.toastr.warning("Maximum value 5", 'Alert', this.config);
            this.marks.graduationRelatedToSociologyMarks=null;
        }
        this.saveDisable = false;
    }
    countTotalQualificationMarks() {
        this.totalQualification = 0;
        if (this.marks.graduationMarks) {
            this.totalQualification += this.marks.graduationMarks;
        }
        if (this.marks.postGraduationMarks) {
            this.totalQualification += this.marks.postGraduationMarks;
        }
        if (this.marks.graduationRelatedToSociologyMarks) {
            this.totalQualification +=
                this.marks.graduationRelatedToSociologyMarks;
        }
        this.total = this.totalExperience + this.totalQualification;
        this.marks.totalMarks = this.totalExperience + this.totalQualification;
    }
    countTotalExperienceMarks() {
        this.totalExperience = 0;
        if (this.marks.thesisMarks) {
            this.totalExperience += this.marks.thesisMarks;
        }
        if (this.marks.thesisGroupMarks) {
            this.totalExperience += this.marks.thesisGroupMarks;
        }
        if (this.marks.nonThesisGroupMarks) {
            this.totalExperience += this.marks.nonThesisGroupMarks;
        }
        if (this.marks.publicationMarks) {
            this.totalExperience += this.marks.publicationMarks;
        }
        this.total = this.totalExperience + this.totalQualification;
        this.marks.totalMarks = this.totalExperience + this.totalQualification;
    }
    changeGraduation(type: string) {
        // if (type === 'g') {
        //     this.marks.graduationMarks = this.graduationType.find(f => f.value === this.marks.graduationType).mark;
        // } else if (type === 'pg') {
        //     this.marks.postGraduationMarks = this.graduationType.find(f => f.value === this.marks.postGraduationType).mark;
        // }
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
                this.marks.stResearchCatTypeId = this.proposal.stResearchCatTypeId;
                this.marks.uuid ? this.update() : this.create();
            }
        });         
    }
    
    private create() {
        this.subscribe$.add(
            this.service.create(this.marks).subscribe((res) => {
                if (res.success) {
                    this.save_button = false;
                    this.snackbarHelper.openSuccessSnackBar();
                    this.marks = res.obj;
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.spinner = false;
                this.save_button = false;
            })
        );
    }
    private update() {
        this.subscribe$.add(
            this.service.update(this.marks).subscribe((res) => {
                if (res.success) {
                    this.save_button = false;
                    this.snackbarHelper.openSuccessSnackBar();
                    this.marks = res.obj;
                } else {
                    this.snackbarHelper.openErrorSnackBar();
                }
                this.spinner = false;
                this.save_button = false;
            })
        );
    }
    previousTab() {
        this.router.navigate(['/researcher/list']);
    }
    goToProfileView() {
        //window.open('researcher/profile/' + uuid);
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
        this.jasperService.generateProfileMarksInstitutionalPdf(uuid, lang,"mPhil&Phd").subscribe((response) => {
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
                //console.log('data = ', data);
                //console.log('data.educationInfos = ', data.educationInfos);
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
            //console.log('111 = ',environment.ibcs.minioEndPointHost + downloadUrl);
            window.open(environment.ibcs.minioEndPointHost + downloadUrl, '_blank');
    }
    downloadPublicationDoc(publicationData:any){
        publicationData.forEach((publication) => {
            window.open(environment.ibcs.minioEndPointHost + publication?.fileUploadModel?.downloadUrl, '_blank');
        })
    }
}
