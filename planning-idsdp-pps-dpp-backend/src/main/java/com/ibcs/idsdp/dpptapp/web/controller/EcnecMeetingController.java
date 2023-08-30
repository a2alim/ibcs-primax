package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.EcnecMeetingConstant;
import com.ibcs.idsdp.dpptapp.model.domain.EcnecMeeting;
import com.ibcs.idsdp.dpptapp.services.EcnecMeetingService;
import com.ibcs.idsdp.dpptapp.web.dto.request.EcnecMeetingRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(EcnecMeetingConstant.ECNEC_MEETING)
public class EcnecMeetingController extends BaseController<EcnecMeeting, EcnecMeetingRequest> {

    private final EcnecMeetingService service;

    public EcnecMeetingController(BaseService<EcnecMeeting, EcnecMeetingRequest> service, EcnecMeetingService service1) {
        super(service);
        this.service = service1;
    }


    /**
     * For Getting All acnec meeting
     *
     * @param requestBodyDTO
     * @return
     */
    @PostMapping(path = EcnecMeetingConstant.GET_ALL_ECNEC_MEETING, produces = "application/json")
    public Page<EcnecMeetingRequest> getActiveMeeting(@RequestBody PageableRequestBodyDTO requestBodyDTO) {
        return service.getActiveMeeting(requestBodyDTO);
    }

    @GetMapping(value = EcnecMeetingConstant.GET_ACTIVE_LIST, produces = "application/json")
    public List<EcnecMeeting> getActiveList(){
        return service.getActiveList();
    }
}
