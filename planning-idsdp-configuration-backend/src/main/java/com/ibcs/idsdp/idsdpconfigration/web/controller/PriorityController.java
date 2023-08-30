package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.PriorityConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Priority;
import com.ibcs.idsdp.idsdpconfigration.services.PriorityService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.PriorityRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.PriorityResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(PriorityConstant.priority)
public class PriorityController extends BaseController<Priority, PriorityRequest> {

    private final PriorityService priorityService;

    public PriorityController(BaseService<Priority, PriorityRequest> service, PriorityService priorityService) {
        super(service);
        this.priorityService = priorityService;
    }

    @GetMapping(PriorityConstant.GET_ACTIVE_PRIORITY)
    public ResponseEntity<List<PriorityResponse>> getActivePriority(){
        return priorityService.getActivePriority();
    }

    @Override
    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public PriorityRequest create(@RequestBody PriorityRequest priorityRequest) {
        priorityRequest.setCode(priorityService.generatePriorityCode(priorityRequest.getNameEn()));
        return super.create(priorityRequest);
    }
}
