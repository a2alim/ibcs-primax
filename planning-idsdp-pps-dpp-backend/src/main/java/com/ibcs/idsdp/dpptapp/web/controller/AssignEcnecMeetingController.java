package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.AssignEcnecMeetingConstant;
import com.ibcs.idsdp.dpptapp.constants.EcnecMeetingConstant;
import com.ibcs.idsdp.dpptapp.model.domain.AssignEcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.domain.EcnecMeeting;
import com.ibcs.idsdp.dpptapp.services.AssignEcnecMeetingService;
import com.ibcs.idsdp.dpptapp.services.EcnecMeetingService;
import com.ibcs.idsdp.dpptapp.web.dto.request.AssignEcnecMeetingRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.EcnecMeetingRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.AssignEcnecMeetingListResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(AssignEcnecMeetingConstant.ASSIGN_ECNEC_MEETING)
public class AssignEcnecMeetingController extends BaseController<AssignEcnecMeeting, AssignEcnecMeetingRequest> {

    private final AssignEcnecMeetingService service;

    public AssignEcnecMeetingController(BaseService<AssignEcnecMeeting, AssignEcnecMeetingRequest> service, AssignEcnecMeetingService service1) {
        super(service);
        this.service = service1;
    }

    @PostMapping(value = AssignEcnecMeetingConstant.CREATE_ASSIGN_ECNEC_MEETING, produces = "application/json")
    public AssignEcnecMeetingRequest createAssignMeeting(@RequestBody AssignEcnecMeetingRequest request){
        return service.createAssingMeeting(request);
    }

    @GetMapping(value = "get-meeting-by-pcuuid/{pcUuid}", produces = "application/json")
    public AssignEcnecMeeting findByPcUuid(@PathVariable String pcUuid){
        return service.findByPcUuidAndIsDeleted(pcUuid);
    }

    @DeleteMapping("/delete-assign-meeting/{pcUuid}")
    public ResponseEntity<ResponseStatus> deleteAssignMeeting(@PathVariable String pcUuid){
        return service.deleteAssignMeeting(pcUuid);
    }

    @GetMapping(value = "get-project-list-by-meeting-id/{meetingId}", produces = "application/json")
    List<AssignEcnecMeetingListResponse> findAllByPcUuid(@PathVariable long meetingId){
        return service.findAllByMeetingId(meetingId);
    }

}
