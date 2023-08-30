package com.ibcs.idsdp.trainninginstitute.services;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.ibcs.idsdp.trainninginstitute.model.domain.AttendanceModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AttendanceRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.AttendanceResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;

public interface AttendanceService {
    ResponseEntity<ApiMessageResponse> createAttendance(AttendanceRequest attendanceRequest);

    ResponseEntity<PaginationResponse<List<AttendanceModel>>> getAttendances(int pageNo, int pageSize);

    ResponseEntity<ApiMessageResponse> deleteAttendance(Long attendanceId);

    ResponseEntity<AttendanceResponse> getSingleAttendance(Long attendanceId);

    ResponseEntity<ApiMessageResponse> editAttendance(Long attendanceId, AttendanceRequest attendanceRequest);

    ResponseEntity<ApiMessageResponse> checkIsExistsAttendance(AttendanceRequest attendanceRequest);

    ResponseEntity<List<AttendanceModel>> findAllByParticipantId(Long participantId);
}
