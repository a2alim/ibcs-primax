import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataComService } from 'app/main/core/services/data-com/data-com.service';
import { StorageService } from 'app/main/core/services/storage/storage.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { UserListServiceService } from 'app/main/modules/settings/services/user-list-service.service';
import * as bl2Js from 'bl2-js-report';
import { environment, reportBackend } from 'environments/environment';
import { addNewIcon, downloadIcon, noteIcon, previousIcon, printIcon } from '../../../constants/button.constants';
import { degree } from '../../../constants/degree.constant';
import { JasperServiceService } from '../../../services/jasper-service.service';
import { ResearchProfileMultiFormService } from '../../../services/research-profile-multi-form.service';
import { ResearcherListService } from '../../../services/researcher-list.service';
import { locale as lngBangla } from '../i18n/bn';
import { locale as lngEnglish } from '../i18n/en';
@Component({
    selector: 'app-profile-view',
    templateUrl: './profile-view.component.html',
    styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent implements OnInit {
    /*----Button---*/
    previousIcon = previousIcon;
    downloadIcon = downloadIcon;
    printIcon = printIcon;
    noteIcon = noteIcon;
    /*----/Button---*/
    loginUserInfo: any;
    loginUserInfo1: any;
    addNewIcon = addNewIcon;
    /*----/Button---*/
    id: any;
    data: any = {};
    uuid: any = null;
    rid: any;
    isInstitutional: any;
    tabData: any;
    userData: any;
    spinner: boolean = true;
    spinner2: boolean = false;
    userList: any[] = [];
    name: string;
    degreeList = degree;
    researcherData:any = [];
    langVal: string;

    constructor(
        private _researchProfileMultiFormService: ResearchProfileMultiFormService,
        private activateRoute: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private userListService: UserListServiceService,
        private router: Router,
        private storageService: StorageService,
        private jasperService: JasperServiceService,
        private _researcherListService: ResearcherListService,
        private dataCom: DataComService
    ) {
            // Language translations
            this._fuseTranslationLoaderService.loadTranslations(lngEnglish,lngBangla);

            this.langVal = localStorage.getItem("currentLang")
            this.dataCom.getPassedItemData.subscribe(res => {
                if (res?.lang) {
                    this.langVal = res?.lang ? res?.lang : '';
                }
            });
    }
    ngOnInit(): void {
        this.isInstitutional = this.activateRoute.snapshot.paramMap.get('isInstitutional');
        this.loginUserInfo1 = this.storageService.getUserData();
        this.id = this.activateRoute.snapshot.paramMap.get('id');
        this.userData = this.storageService.getUserData();
        this.loginUserInfo = this.userData;
        if (this.id == '0' && this.userData.id > 0) {
            this._researchProfileMultiFormService
                .getUserProfileUuid(this.userData.id)
                .subscribe((data) => {
                    if (data == null) {
                        this.router.navigate([
                            'researcher-profile-information/add',
                        ]);
                    } else {
                        this.uuid = data.uuid;
                        this.viewProfile(data.uuid);
                    }
                });
        } else if (this.userData.id < 1) {
            this.router.navigate(['researcher-profile-information/add']);
        } else {
            this.viewProfile(this.id);
        }
    }
    backResearcherprofilelist() {
        this.router.navigate(['researcher-profile-information']);
    }
    viewProfile(profileUuid: any) {
        this.spinner = true;
        this._researchProfileMultiFormService.profileView(profileUuid).subscribe(
            (data) => {
                this.tabData = data;
                this.data = data;
                if (this.tabData.educationInfos && this.tabData.educationInfos.length > 0) {
                    this.tabData.educationInfos = this.tabData.educationInfos.map(m => {
                        m.sl = this.degreeList.find(f => f.degree == m.certificationName).sl;
                        return m;
                    });
                    this.tabData.educationInfos.sort((a, b) => 0 - (a.sl > b.sl ? -1 : 1));
                    this.data.educationInfos = this.tabData.educationInfos;
                }
                this.spinner = false;
                this.getUserList();
            },
            (error) => {
                this.spinner = false;
            }
        );

        this._researcherListService.resercherProfileDate(profileUuid).subscribe(response => {
                if (response.success) {
                    this.researcherData = response.model;
                }
            },
            error => {
                this.spinner = false;
            }
        );
    }
    getUserList() {
        this.userListService.getAllUser().subscribe((res) => {
            this.userList = res ? res : [];
            this.userList.forEach((element) => {
                if (element.id == this.tabData.personalInfo.userId) {
                    this.name = element.name;
                }
            });
        });
    }
    back() {
        this.router.navigate(['/researcher-profile-information']);
    }
    download() {
        let lang = localStorage.getItem("currentLang");
        this.genPdf(lang);
    }
    downloadPdf($fileName = '') {
        this.data['fileName'] = $fileName;
        this.data['templateName'] = 'ti-reports/Researcher-Profile-Information';
        this.data['lng'] = localStorage.getItem("currentLang");
        this.data['data'] = JSON.stringify(this.data);
        this.data['userDetails'] = JSON.stringify(this.userData);
        this.data['isInstitutional'] = JSON.stringify(this.isInstitutional);
        this.data['name'] = JSON.stringify(this.name);
        //Optional
        this.data['view'] = 0; // 0 = false or 1 = true
        this.data['print_r'] = 0; // 0 = false or 1 = true
        let actionUrl = `${reportBackend}/pdf-generate-post`;
        bl2Js(this.data, actionUrl);
    }

    print() { }
    genPdf(lang) {
        let id;
        if (this.id === '0') {
            id = this.uuid
        } else {
            id = this.id;
        }
        this.spinner2 = true;
        this.jasperService.generateProfilePdf(id, lang).subscribe((response) => {
            this.spinner2 = false;
            let file = new Blob([response], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        }, error => {
            this.spinner2 = false;
        })
    }
    printDiv(divName) {
        //window.location.href = window.location.href;
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        //return false;
        window.location.reload();
        document.body.innerHTML = originalContents;
    }
    editProfile() {
        this.router.navigate(['researcher-profile-information/' + this.id + '/edit/' + this.tabData?.personalInfo.id]);
    }
    downloadDoc(downloadUrl: any) {
        //console.log('111 = ',environment.ibcs.minioEndPointHost + downloadUrl);
        window.open(environment.ibcs.minioEndPointHost + downloadUrl, '_blank');
    }
    downloadFile(data: any) {
        console.log('222 = ',environment.ibcs.minioEndPointHost + data.downloadUrl);

        window.open(environment.ibcs.minioEndPointHost + data.downloadUrl, '_blank');
    }


}
