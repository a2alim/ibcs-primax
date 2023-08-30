package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.AttendanceModel;
import com.ibcs.idsdp.trainninginstitute.services.AttendanceService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AttendanceRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.AttendanceResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@AllArgsConstructor
@RequestMapping("/attendances")
public class AttendanceController {
	
    private final AttendanceService attendanceService;

    @PostMapping()
    public ResponseEntity<ApiMessageResponse> createAttendance(@RequestBody AttendanceRequest attendanceRequest) {
        return attendanceService.createAttendance(attendanceRequest);
    }


    @PostMapping("/is-exist")
    public ResponseEntity<ApiMessageResponse> isExistsAttendance(@RequestBody AttendanceRequest attendanceRequest) {
        return attendanceService.checkIsExistsAttendance(attendanceRequest);
    }

    @GetMapping()
    public ResponseEntity<PaginationResponse<List<AttendanceModel>>> getAttendances(@RequestParam(defaultValue = "0") int pageNo,
                                                                                    @RequestParam(defaultValue = "25") int pageSize) {
        return attendanceService.getAttendances(pageNo, pageSize);
    }

    @PutMapping("/{attendanceId}")
    public ResponseEntity<ApiMessageResponse> editAttendance(@PathVariable Long attendanceId, @RequestBody AttendanceRequest attendanceRequest) {
        return attendanceService.editAttendance(attendanceId, attendanceRequest);
    }

    @DeleteMapping("/{attendanceId}")
    public ResponseEntity<ApiMessageResponse> deleteAttendance(@PathVariable Long attendanceId) {
        return attendanceService.deleteAttendance(attendanceId);
    }

    @GetMapping("/{attendanceId}")
    public ResponseEntity<AttendanceResponse> getSingleAttendance(@PathVariable Long attendanceId) {
        return attendanceService.getSingleAttendance(attendanceId);
    }
    
    @GetMapping("/find-all-by-participant-id/{participantId}")
    public ResponseEntity<List<AttendanceModel>> findAllByParticipantId(@PathVariable Long participantId) {
        return attendanceService.findAllByParticipantId(participantId);
    }

}
