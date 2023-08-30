import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PaginationResponse } from "../models/pagination-response.model";
import { CourseResponse, CourseScheduleModel } from "../models/course-response.model";
import { CourseModel } from "../models/course.model";
import { environment } from "../../../../../environments/environment";
import { Observable } from "rxjs";
import { ApiResponseModel } from "../models/api-response.model";

@Injectable({
    providedIn: 'root'
})
export class CourseService {

    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }

    getCourseList(size: number, page: number) {
        return this.http.get<PaginationResponse<any[]>>(this.baseTiEndPoint + "course-schedules?pageNo=" + page + "&pageSize=" + size);
    }

    saveCourseSchedule(data: CourseScheduleModel): Observable<any> {
        return this.http.post<ApiResponseModel>(this.baseTiEndPoint + "course-schedule/create", data);
    }

    updateCourseSchedule(data: CourseScheduleModel): Observable<any> {
        return this.http.put(this.baseTiEndPoint + "course-schedule/update", data);
    }

    getAllCourseScheduleBy(courseId): Observable<any> {
        return this.http.get(this.baseTiEndPoint + "course-schedules/view/listData/" + courseId);
    }

    getCourseListPromise(size: number, page: number): Promise<PaginationResponse<CourseResponse[]>> {
        return this.http.get<PaginationResponse<CourseResponse[]>>(this.baseTiEndPoint + "course-schedules?pageNo=" + page + "&pageSize=" + size).toPromise();
    }


    createCourse(newCourseModel: CourseModel) {
        return this.http.post<ApiResponseModel>(this.baseTiEndPoint + "course-schedules", newCourseModel);
    }

    deleteCourse(id) {
        return this.http.delete(this.baseTiEndPoint + "course-schedules/" + id);
    }

    deleteCourseSchedule(rowUuid): Observable<any> {
        const api = this.baseTiEndPoint + 'course-schedule/delete/' + rowUuid;
        return this.http.delete(api);
    }

    getCourseById(courseId: number) {
        return this.http.get<any>(this.baseTiEndPoint + "course-schedules/" + courseId);
    }

    editCourse(newCourseModel: CourseModel, courseId: number) {
        return this.http.put(this.baseTiEndPoint + "course-schedules/" + courseId, newCourseModel);
    }

    getCourseByProposalId(value: number) {
        return this.http.get<CourseModel>(this.baseTiEndPoint + "course-schedules/proposal/" + value);
    }

    getCourseSchedule(value: number): any {
        return this.http.get<CourseModel>(this.baseTiEndPoint + "course-schedule/by-proposal-id/" + value);
    }

    getCourseByProposalId2(value: number) {
        return this.http.get<any>(this.baseTiEndPoint + "course-schedules/proposal/" + value);
    }

    getCourseByProposalId_(value: number) {
        return this.http.get<any>(this.baseTiEndPoint + "course-schedule/by-proposal-id/" + value);
    }


    getCourseBySessionId_(value: number) {
        return this.http.get<any>(this.baseTiEndPoint + "course-schedule/get-by-id/" + value);
    }

    getListData(pageSize: number, page: number, proposalId: number) {
        return this.http.get<PaginationResponse<any[]>>(this.baseTiEndPoint + "course-schedule?pageNo=" + page + "&pageSize=" + pageSize + "&proposalId=" + proposalId);
    }
}
