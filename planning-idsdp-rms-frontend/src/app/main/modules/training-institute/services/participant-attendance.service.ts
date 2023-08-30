import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PaginationResponse} from "../models/pagination-response.model";
import {environment} from "../../../../../environments/environment";
import {AttendanceModel} from "../models/attendance.model";
import {AttendanceResponse} from "../models/attendance-response.model";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ParticipantAttendanceService {

    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }

    getParticipantAttendanceList(size: number, page: number) {
        return this.http.get<PaginationResponse<AttendanceModel[]>>(
            this.baseTiEndPoint + "attendances?pageNo=" + page + "&pageSize=" + size);
    }

    createParticipantAttendance(attendanceModel: AttendanceResponse):Observable<any> {
        return this.http.post(this.baseTiEndPoint + "attendances", attendanceModel);
    }

    checkIsExistAttendance(attendanceModel: AttendanceResponse):Observable<any> {
        return this.http.post(this.baseTiEndPoint + "attendances/is-exist", attendanceModel);
    }

    getParticipantAttendanceById(attendanceId: number) {
        return this.http.get<AttendanceModel>(
            this.baseTiEndPoint + "attendances/" + attendanceId);
    }

    getParticipantAttendanceById2(attendanceId: number) {
        return this.http.get<AttendanceResponse>(this.baseTiEndPoint + "attendances/" + attendanceId);
    }

    getAttendanceByParticipantId(participantId: number) : any{
        return this.http.get<AttendanceResponse>(this.baseTiEndPoint + "attendances/find-all-by-participant-id/" + participantId);
    }


    editParticipantAttendance(newParticipantModel: AttendanceResponse, attendanceId: number) {
        return this.http.put(this.baseTiEndPoint + "attendances/" + attendanceId, newParticipantModel);
    }

    deleteAttendance(id: number) {
        return this.http.delete(this.baseTiEndPoint + "attendances/" + id);
    }


}
