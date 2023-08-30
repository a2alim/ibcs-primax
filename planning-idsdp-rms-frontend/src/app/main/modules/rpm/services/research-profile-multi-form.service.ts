import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { ApiService } from "../../../core/services/api/api.service";
import { PersonalInfoFormModel } from '../models/PersonalInfoFormModel';


@Injectable({ providedIn: 'root' })
export class ResearchProfileMultiFormService {

    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;
    baseRmsConfigurationApiEndPoint = environment.ibcs.rmsConfigurationBackend;

    constructor(private apiService: ApiService, private _httpClient: HttpClient) {

    }


    saveData(dataList, files: File[], tag): Observable<any> {

        dataList.forEach(data => {
            data.profilePersonalInfoId = localStorage.getItem('profilePersonalInfoId');
        });

        const formData = new FormData();
        formData.append('body', JSON.stringify(dataList));
        if (files != null) {
            files.forEach(res => {
                formData.append('file', res)
            })
        }
        return this.apiService.post(this.baseRmsRpmApiEndPoint + 'researcher-profile/others-tab/' + tag, formData);
    }


    saveDataNew(dataList, files: File[], tag): Observable<any> {
        const formData = new FormData();
        formData.append('body', JSON.stringify(dataList));
        if (files != null) {
            files.forEach(res => {
                formData.append('file', res)
            })
        }
        return this.apiService.post(this.baseRmsRpmApiEndPoint + 'researcher-profile/others-tab/' + tag, formData);
    }

    updateData(uid, dataList, files: File[], tag): Observable<any> {

        dataList.forEach(data => {
            data.profilePersonalInfoId = uid;
        });
        const formData = new FormData();
        formData.append('body', JSON.stringify(dataList));
        if (files != null) {
            files.forEach(res => {
                formData.append('file', res)
            })
        }
        return this.apiService.update(this.baseRmsRpmApiEndPoint + 'researcher-profile/others-tab/' + tag + '/' + uid, formData);
    }

    create(files: any, pm: PersonalInfoFormModel): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/tab-one';
        const formData = new FormData();
        files.forEach(res => {
            formData.append('file', res.file)
        })
        formData.append('body', JSON.stringify(pm));
        return this.apiService.post(url, formData);

    }


    saveResearcherProfilePersonalInstitutionalInfo(data: any, attachedFile: File): Observable<any> {
        const formData = new FormData();
        formData.append('body', JSON.stringify(data));
        formData.append('file', attachedFile);
        const url: string = this.baseRmsRpmApiEndPoint + 'researcher-profile/tab-one-institutional';
        return this.apiService.post(url, formData).pipe(map((res: any) => res));
    }


    updateResearcherProfilePersonalInstitutionalInfo(data: any, attachedFile: File, uuid): Observable<any> {
        console.log('test ==== >>>>> ', data.isInstitutional);
        const formData = new FormData();
        formData.append('body', JSON.stringify(data));
        formData.append('file', attachedFile);
        const url: string = this.baseRmsRpmApiEndPoint + 'researcher-profile/tab-one-institutional/' + uuid;
        return this.apiService.put(url, formData).pipe(map((res: any) => res));
    }


    getListOfResearcherProfile(offset: number, pageSize: number,): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/pagination/' + offset + '/' + pageSize;
        return this.apiService.get(url);

    }

    getUserProfileUuid(userId: any): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/by-userId/' + userId;
        return this.apiService.get(url);
    }

    profileView(uuid: any): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/profile-view/' + uuid;
        return this.apiService.get(url);
    }


    deleteProfile(uuid: string): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/tab-one/delete/';
        return this.apiService.delete(url, uuid);

    }


    getResearcherProfileByUuid(uuid: string): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/get-by-uuid/' + uuid;
        return this.apiService.get(url);

    }


    getResearcherProfileById(id: number): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/get-by-id/' + id;
        return this.apiService.get(url);
    }


    getDivisions(): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + '/api/common-type/get-seciality/9';
        return this.apiService.get(url);

    }


    update(uuid: string, files: any, fileIndex:any, pm: PersonalInfoFormModel) {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/tab-one/' + uuid;

        const formData = new FormData();
        files.forEach(res => {
            formData.append('file', res.file)
        })
        formData.append('body', JSON.stringify(pm));
        formData.append('fileIndex', fileIndex);

        return this.apiService.update(url, formData);
    }

    updateDataByTabName(id: number, dataList, files: File[], tag): Observable<any> {
        dataList.forEach(data => {
            data.profilePersonalInfoId = id;
        });
        const formData = new FormData();
        formData.append('body', JSON.stringify(dataList));
        if (files != null) {
            files.forEach(res => {
                formData.append('file', res)
            })
        }
        return this._httpClient.put(this.baseRmsRpmApiEndPoint + 'researcher-profile/others-tab/' + tag + '/' + id + '/update', formData);
    }

    saveOrUpdateEducation(data,profileId):Observable<any>{
        return this._httpClient.post(this.baseRmsRpmApiEndPoint + 'researcher-profile/educationSaveOrUpdate/'+profileId,data);

    }

    saveOrUpdatePulicaion(data,profileId):Observable<any>{
        return this._httpClient.post(this.baseRmsRpmApiEndPoint + 'researcher-profile/publicationSaveOrUpdate/'+profileId,data);
    }

    saveResearcherExperience(data,profileId):Observable<any>{
        return this._httpClient.post(this.baseRmsRpmApiEndPoint + 'researcher-profile/save-research-experience/'+profileId,data);
    }


    findByUserId(userId: number) {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/by-userId/' + userId;
        return this.apiService.get(url);
    }
    getResearcherProfileByEmail(email: string, isInstitutional: boolean) {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/by-email-and-researcher-type/' + email + '/' + isInstitutional;
        return this.apiService.get(url);
    }

    // http://localhost:8081/rms-configuration/division/activeDivision
    // http://localhost:8081/rms-configuration/zilla/find-by-division-id/1
    // http://localhost:8081/rms-configuration/upazilla/find-by-zilla-id/3

    getDivisionList(): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/division/activeDivision';
        return this.apiService.get(url);
    }

    getDistrictListByDivisionId(divisionId: number): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/zilla/find-by-division-id/' + divisionId;
        return this.apiService.get(url);
    }

    getUpazilaListByDistrictId(districtId: number): Observable<any> {
        const url = this.baseRmsConfigurationApiEndPoint + 'api/upazilla/find-by-zilla-id/' + districtId;
        return this.apiService.get(url);
    }

    getEducationInfoByProfileUuid(uuid: string): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/profile-info-with-related-info-by-id/' + uuid;
        return this.apiService.get(url);

    }

    updateDeclaration(data: { id: number; declaration: string }): Observable<any> {
        const url = this.baseRmsRpmApiEndPoint + 'researcher-profile/tab-one/update/declaration';
        return this._httpClient.put(url, data);
    }

    getProfileStatusFindByUuid(profileUuid) {
        const url = this.baseRmsRpmApiEndPoint + `researcher-profile/profile-status-find-by-uuid/${profileUuid}`;
        return this.apiService.get(url);
    }

    saveOrUpdateNotApplicable(uId):Observable<any>{
        var pId = sessionStorage.getItem('pId');
        var publicationInfo = sessionStorage.getItem('publicationInfo');
        var proExperience = sessionStorage.getItem('proExperience');
        var researchExp = sessionStorage.getItem('researchExp');
        var trainingInfo = sessionStorage.getItem('trainingInfo');

        let rmsProfileNotApplicable = {
            id:0,
            m1ResearcherProfilePersonalInfoId:0,
            publicationInfo:0,
            proExperience:0,
            researchExp:0,
            trainingInfo:0,
            formName:"",
            modelName:""
         }

        rmsProfileNotApplicable.id = (typeof pId === 'string') ? +pId : 0;
        rmsProfileNotApplicable.m1ResearcherProfilePersonalInfoId = uId;
        rmsProfileNotApplicable.publicationInfo = (typeof publicationInfo === 'string') ? +publicationInfo : 2;
        rmsProfileNotApplicable.proExperience = (typeof proExperience === 'string') ? +proExperience : 2;
        rmsProfileNotApplicable.researchExp = (typeof researchExp === 'string') ? +researchExp : 2;
        rmsProfileNotApplicable.trainingInfo = (typeof trainingInfo === 'string') ? +trainingInfo : 2;

        rmsProfileNotApplicable.modelName = 'researcher_profile';
        rmsProfileNotApplicable.formName = 'publicationInfo';
        return this._httpClient.post(this.baseRmsRpmApiEndPoint + 'researcher-profile/not-applicable',rmsProfileNotApplicable);
    }

    getNotApplicable(profileId, modelName) {
        const url = this.baseRmsRpmApiEndPoint + `researcher-profile/get-not-applicable-date/${profileId}/${modelName}`;
        return this.apiService.get(url);
    }
}
