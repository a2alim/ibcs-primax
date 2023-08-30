import { Component, OnInit } from '@angular/core';
import { UnsubscribeAdapterComponent } from "../../../../core/helper/unsubscribeAdapter";
import { FuseTranslationLoaderService } from "../../../../core/services/translation-loader.service";
// import { locale as lngEnglish } from "./i18n/";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from 'app/main/core/services/api/api.service';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import { environment } from 'environments/environment';
import { downloadIcon, noteIcon, previousIcon, printIcon } from '../../constants/button.constants';
import { sdgsGoalsList } from '../../contants/sdgs-goals-list.constant';
import { ResearcherProposal } from "../../models/ResearcherProposal";
import { ResearcherProposalActionPlan } from "../../models/ResearcherProposalActionPlan";
import { ResearcherProposalBudgetDetails } from "../../models/ResearcherProposalBudgetDetails";
import { ResearcherProposalInformation } from "../../models/ResearcherProposalInformation";
import { ResearcherProposalInstitutionInformation } from "../../models/ResearcherProposalInstitutionInformation";
import { ResearcherProposalRscWorkingInOrganization } from "../../models/ResearcherProposalRscWorkingInOrganization";
import { ResearcherProposalUploadDoc } from "../../models/ResearcherProposalUploadDoc";
import { ResearcherSupervisorInformation } from "../../models/ResearcherSupervisorInformation";
import { FiscalYearWiseDocFilesService } from '../../services/fiscal-year-wise-doc-files.service';
import { ResearcherProposalService } from "../../services/researcher-proposal.service";

@Component({
    selector: 'XXapp-Xresearch-XXproposal-view-detailsX',
    templateUrl: './research-proposal-view-details.component.html',
    styleUrls: []
})
export class ResearchProposalViewDetailsComponent extends UnsubscribeAdapterComponent implements OnInit {

    uuid: string;
    spinner: boolean;

    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    /*----/Button---*/

    userList: any[] = [];

    sdgsGoalsList = sdgsGoalsList;
    documentTypeList: any[] = [];

    data: {
        researcherProposal: ResearcherProposal,
        researcherProposalInfo: ResearcherProposalInformation,
        researcherProposalInstituteInfo: ResearcherProposalInstitutionInformation,
        researcherProposalRscWorkingInOrg: ResearcherProposalRscWorkingInOrganization[],
        researcherSupervisorInfo: ResearcherSupervisorInformation,
        researcherProposalUploadDoc: ResearcherProposalUploadDoc[],
        researcherProposalActionPlan: ResearcherProposalActionPlan[],
        researcherProposalBudgetDetails: ResearcherProposalBudgetDetails[];
    };

    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private researcherProposalService: ResearcherProposalService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _fiscalYearWiseDocFilesService: FiscalYearWiseDocFilesService,
        private userListService: UserListServiceService,
        private api: ApiService,
    ) {
        super();
        // this._fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.uuid = params['uuId'];
        });
        this.getAllData();
        this.getUserList();
        this.getCommonTypeListData();
    }

    private getAllData() {
        this.spinner = true;
        this.subscribe$.add(
            this.researcherProposalService.getResearcherProposalDetailsByUuid(this.uuid).subscribe(
                res => {
                    if (res.success) {
                        this.data = res.obj;
                    }
                    this.spinner = false;
                }
            )
        )
    }

    back() {
        this.router.navigate(['/researcher-profile-information']);

    }

    download() {

    }

    print() {

    }

    downloadFile(data: any) {
        this.spinner = true;
        this._fiscalYearWiseDocFilesService.downloadFile(data.fileDownloadUrl).subscribe(
            response => {
                this.spinner = false;
            },
            error => {
                this.spinner = false;
            }
        );
    }

    getUserList() {
        this.userListService.getAllUser().subscribe(
            res => {
                this.userList = res ? res : [];
            }
        );
    }


    showUserName(userId: number) {
        if (!userId) {
            return '';
        }
        return this.userList.find(f => f.userId == userId).name ? this.userList.find(f => f.userId == userId).name : '';
    }

    sdgsGoals(id: number) {
        if (!id) {
            return '';
        }
        return this.sdgsGoalsList.find(f => f.id == id).name;
    }

    getCommonTypeListData() {
        const baseUrl = environment.ibcs.rmsConfigurationBackend + 'api/common-type/';
        const getUrl = baseUrl + 'get-list';
        this.api.get(getUrl).subscribe(res => {
            if (res.success && res.items) {
                this.documentTypeList = res.items;
                this.documentTypeList = this.documentTypeList.filter(f => f.typeNo == 3) ? this.documentTypeList.filter(f => f.typeNo == 3) : [];
            }            
        });
    }

    showDocumentTypeName(id: number) {
        if (!id) {
            return '';
        }
        return this.documentTypeList.find(f => f.id == id) ? this.documentTypeList.find(f => f.id == id).typeName : '';
    }
}

