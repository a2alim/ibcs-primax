import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from "@angular/router";
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { ConfirmDialogComponent } from 'app/main/shared/components/confirm-dialog/confirm-dialog.component';
import { environment } from 'environments/environment';
import { ToastrService } from "ngx-toastr";
import { SnackbarHelper } from "../../../../../core/helper/snackbar.helper";
import { UnsubscribeAdapterComponent } from "../../../../../core/helper/unsubscribeAdapter";
import { FuseTranslationLoaderService } from "../../../../../core/services/translation-loader.service";
import { ProfileMarksSetupService } from "../../../../settings/services/ProfileMarksSetupService";
import { downloadIcon, previousIcon, printIcon, saveIcon } from '../../../constants/button.constants';
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
    selector: 'app-researcher-profile-marks-promotional',
    templateUrl: './researcher-profile-marks-institution-research.component.html',
    styleUrls: ['./researcher-profile-marks-institution-research.component.scss']
})
export class ResearcherProfileMarksInstitutionResearchComponent extends UnsubscribeAdapterComponent implements OnInit {

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
    totalMarks: number = 0;
    graduationType = [];
    saveDisable = true;
    spinner2:boolean=false;
    save_button = true;

    organizationAccording = 0;
    institutionalFunctional = 0;
    userDetails:any;

    profileInfo:any;
    showModal = false;
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
                private toastr: ToastrService,
                private storageService: StorageService,
                private jasperService:JasperServiceService,
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
                            //this.countTotalExperienceMarks();
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
                            this.setMark();
                            this.spinner = false;
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
        this.spinner = true;

        /* --- ----Get profile information of institute's---- */
        let profileInfo = this.profile?.researcherProfilePersonalInfoMaster;

        /* ----- Set real information this fields -----  */
        this.marks.realPostGraduation = profileInfo?.masters ? profileInfo.masters : 0;
        this.marks.realMphil = profileInfo?.mphil ? profileInfo.mphil : 0
        this.marks.realPhd = profileInfo?.phd ? profileInfo.phd : 0 ;

        /* --- ----Set mark to post graduation field---- */
        if(profileInfo?.masters >= 0 && profileInfo?.masters <= 3){
            this.marks.postGraduationMarks =  this.category?.instPostGraduate1 ? this.category.instPostGraduate1 : 0;
        }
        if(profileInfo?.masters > 3){
            this.marks.postGraduationMarks =  this.category?.instPostGraduate2 ? this.category.instPostGraduate2 : 0;
        }

        /* --- ----Set mark to MPhil field---- */
        if(profileInfo?.mphil >= 1 && profileInfo?.mphil <= 2){
            this.marks.mphilMarks =  this.category?.instMPhil1 ? this.category.instMPhil1 : 0;
        }
        if(profileInfo?.mphil > 2){
            this.marks.mphilMarks =  this.category?.instMPhil2 ? this.category.instMPhil2 : 0;
        }

            /* --- ----Set mark to PhD field---- */
        if(profileInfo?.phd >= 1 && profileInfo?.phd <= 2){
            this.marks.phdMarks =  this.category?.instPhd1 ? this.category.instPhd1 : 0;
        }
        if(profileInfo?.phd > 2){
            this.marks.phdMarks =  this.category?.instPhd2 ? this.category.instPhd2 : 0;
        }

        this.marks.realResearchWork = profileInfo?.totalResearchExperience ? profileInfo.totalResearchExperience : 0;
        if(profileInfo?.totalResearchExperience < 2)
        {
            this.marks.researchWorkMarks = this.category?.researchExperience1 ? this.category.researchExperience1 : 0;
        }
        if(profileInfo?.totalResearchExperience == 3)
        {
            this.marks.researchWorkMarks = this.category?.researchExperience2 ? this.category.researchExperience2 : 0;
        }
        if(profileInfo?.totalResearchExperience > 3)
        {
            this.marks.researchWorkMarks = this.category?.researchExperience3 ? this.category.researchExperience3 : 0;
        }



        /*------------------National Publication Information----------------- */
        let localPublication = this.profile?.publicationInfoList.filter(f => f.publishedIn === 'National');

        console.log("localPublication --- ", localPublication);

        let countLocalPublication = (localPublication?.length > 0) ?  localPublication?.length: 0;
        this.marks.realLocalPublication = countLocalPublication;
        this.marks.localPublicationMarks = 0;

        if(countLocalPublication >= 1  && countLocalPublication <= 5)
        {
            this.marks.localPublicationMarks = this.category?.localPublication1 ? this.category?.localPublication1 : 0
        }
        if(countLocalPublication >= 6  && countLocalPublication <= 10)
        {
            this.marks.localPublicationMarks = this.category?.localPublication2 ? this.category?.localPublication2 : 0
        }
        if(countLocalPublication > 10)
        {
            this.marks.localPublicationMarks = this.category?.localPublication3 ? this.category?.localPublication3 : 0
        }
        /*------------------/National Publication Information----------------- */

        /*------------------International Publication Information----------------- */

        let InternationalPublication = this.profile?.publicationInfoList.filter(f => f.publishedIn === 'International');
        console.log("InternationalPublication --- ", InternationalPublication);

        let countInterPublication = (InternationalPublication?.length > 0) ?  InternationalPublication?.length: 0;
        this.marks.realInternalPublication = countInterPublication;
        this.marks.internalPublicationMarks = 0;

        if(countInterPublication >= 1  && countInterPublication <= 5)
        {
            this.marks.internalPublicationMarks = this.category?.interPublication1 ? this.category?.interPublication1 : 0
        }
        if(countInterPublication >= 6  && countInterPublication <= 10)
        {
            this.marks.internalPublicationMarks = this.category?.interPublication2 ? this.category?.interPublication2 : 0
        }
        if(countInterPublication > 10)
        {
            this.marks.internalPublicationMarks = this.category?.interPublication3 ? this.category?.interPublication3 : 0
        }
        /*------------------/International Publication Information----------------- */

        this.countTotalQualificationMarks();
        //this.countTotalExperienceMarks();
        this.checkedFormValidation();
        this.spinner = false;

        console.log('marks -', this.marks)
    }
    countTotalQualificationMarks() {
        let organizationAccording = this.organizationAccording= this.marks?.institutionalTypeInvolvementMarks ? this.marks?.institutionalTypeInvolvementMarks : 0;
        if(this.category?.organizationStructure < organizationAccording)
        {
            this.marks.institutionalTypeInvolvementMarks = 0;
            this.toastr.error("Enter Maximum "+this.category?.organizationStructure+ " Number");
        }

        let institutionalFunctional = this.institutionalFunctional = this.marks?.institutionalFunctionalInvolvementMarks ? this.marks?.institutionalFunctionalInvolvementMarks : 0;
        if(this.category?.organizationActivity < institutionalFunctional)
        {
            this.marks.institutionalFunctionalInvolvementMarks = 0;
            this.toastr.error("Enter Maximum "+this.category?.organizationActivity+ " Number");
        }

        this.totalQualification = Number(organizationAccording) + Number(institutionalFunctional) +
         this.marks?.postGraduationMarks +
         this.marks?.mphilMarks +
         this.marks?.phdMarks + 0;

        this.totalExperience = this.marks?.localPublicationMarks + this.marks?.internalPublicationMarks + this.marks?.researchWorkMarks +0;

        this.marks.totalMarks= this.totalExperience + this.totalQualification;
    }
    // countTotalExperienceMarks() {
    //     this.totalExperience = 0;
    //     if (this.marks.researchWorkMarks) {
    //         this.totalExperience += this.marks.researchWorkMarks;
    //     }
    //     if (this.marks.localPublicationMarks) {
    //         this.totalExperience += this.marks.localPublicationMarks;
    //     }
    //     if (this.marks.internalPublicationMarks) {
    //         this.totalExperience += this.marks.internalPublicationMarks;
    //     }
    //     this.total = this.totalExperience + this.totalQualification;

    //     this.marks.totalMarks = this.totalExperience + this.totalQualification;
    // }

    private setRealInfo() {
        this.spinner = true;
        // if (this.profile.educationInfoList.length > 0) {
        //     const pg = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.POST_GRADUATE)[0];
        //     this.marks.realPostGraduation = pg?.division ? pg?.division : pg?.cgpa;
        //     const mphil = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.MPHIL)[0];
        //     this.marks.realMphil = mphil?.division ? mphil?.division : mphil?.cgpa;
        //     const phd = this.profile.educationInfoList.filter(f => f.certificationName === EducationDegree.PHD)[0];
        //     this.marks.realPhd = phd?.division ? phd?.division : phd?.cgpa;
        // }
        // this.marks.realInstitutionalTypeInvolvement = this.profile.researcherProfilePersonalInfoMaster.age;
        // this.marks.realInstitutionalFunctionalInvolvement = this.profile.researcherProfilePersonalInfoMaster.occupation;
        // this.marks.realResearchWork = this.profile.researchExperienceList.length;
        // this.marks.realLocalPublication = (this.profile.publicationInfoList.length > 0) ? this.profile.publicationInfoList.filter(f => f.publishedIn === PublicationType.NATIONAL).length : 0;
        // this.marks.realInternalPublication = (this.profile.publicationInfoList.length > 0) ? this.profile.publicationInfoList.filter(f => f.publishedIn === PublicationType.INTERNATIONAL).length : 0;
        this.checkedFormValidation();
        this.spinner = false;
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
                            this.spinner = false;
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
        // this.saveDisable = !(this.marks.institutionalTypeInvolvementMarks && this.marks.realInstitutionalTypeInvolvement &&
        //     this.marks.researchWorkMarks && this.marks.realResearchWork &&
        //     this.marks.institutionalFunctionalInvolvementMarks && this.marks.realInstitutionalFunctionalInvolvement &&
        //     this.marks.localPublicationMarks && this.marks.realLocalPublication &&
        //     this.marks.internalPublicationMarks && this.marks.realInternalPublication &&
        //     this.marks.postGraduationMarks && this.marks.realPostGraduation &&
        //     this.marks.mphilMarks && this.marks.realMphil &&
        //     this.marks.phdMarks && this.marks.realPhd);
        //this.saveDisable = false;
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
            this.service.create(this.marks).subscribe(res => {
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
            this.service.update(this.marks).subscribe(res => {
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
        let isInstitutional = this.proposal?.researcherProfilePersonalInfoMaster?.isInstitutional;
        window.open(`researcher-profile-information/${uuid}/${isInstitutional}/view`);
    }

    download() {
        let lang = localStorage.getItem("currentLang");
        this.genPdf(this.proposalUuid, lang)

    }


    genPdf(uuid, lang) {
        this.spinner2 = true;
        this.jasperService.generateProfileMarksInstitutionalPdf(uuid, lang,"institutional").subscribe((response) => {
            this.spinner2 = false;
            let file = new Blob([response], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, error => {
            this.spinner2 = false;
        })

    }

    getResearchersProfileInfo(profileUuid){
        this.researchProfileMultiFormService.profileView(profileUuid).subscribe(
            (data) => {
                console.log('data = ', data);
                console.log('data.educationInfos = ', data.educationInfos);
                this.profileInfo = data;
                let $this = this;
                $this.profileInfo.NationalDoc = []
                $this.profileInfo.InternationalDoc = [];
                data.publicationInfos.forEach(val =>{                
                    if(val.publishedIn == 'National')
                    {
                        $this.profileInfo.NationalDoc.push({"articleTitle":val.articleTitle,"docFile":val.fileUploadModel.downloadUrl});
                    }
                    if(val.publishedIn == 'International')
                    {
                        $this.profileInfo.InternationalDoc.push({"articleTitle":val.articleTitle,"docFile":val.fileUploadModel.downloadUrl});
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
    showModalBox(){
        console.log('dddddddddddddddddddd');
        this.showModal = true;
    }
    toggleModal(){
        this.showModal = !this.showModal;
    }
}
