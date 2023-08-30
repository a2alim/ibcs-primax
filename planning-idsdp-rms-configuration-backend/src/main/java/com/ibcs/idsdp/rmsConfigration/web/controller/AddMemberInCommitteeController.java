package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.model.domain.AddMemberInCommittee;
import com.ibcs.idsdp.rmsConfigration.services.AddMemberInCommitteeService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.AddMemberInCommitteeRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.AddMemberInCommitteeResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping("api/add-member-in-committee/")
public class AddMemberInCommitteeController extends BaseController<AddMemberInCommittee, AddMemberInCommitteeRequest, AddMemberInCommitteeResponse> {

    public final AddMemberInCommitteeService addMemberInCommitteeService;

    public AddMemberInCommitteeController(BaseService<AddMemberInCommittee, AddMemberInCommitteeRequest, AddMemberInCommitteeResponse> service, AddMemberInCommitteeService addMemberInCommitteeService) {
        super(service);
        this.addMemberInCommitteeService = addMemberInCommitteeService;
    }

    @PostMapping(path = "add", produces = "application/json")
    public Response<AddMemberInCommitteeResponse> dataSave(@RequestBody AddMemberInCommitteeRequest addMemberInCommitteeRequest) {

        return addMemberInCommitteeService.dataSave(addMemberInCommitteeRequest);
    }

    @PutMapping(path = "edit", produces = "application/json")
    public Response<AddMemberInCommitteeResponse> dataUpdate(@RequestBody AddMemberInCommitteeRequest addMemberInCommitteeRequest) {
        return addMemberInCommitteeService.dataUpdate(addMemberInCommitteeRequest);
    }

    @GetMapping(path = "get-active-data", produces = "application/json")
    public ResponseEntity<List<AddMemberInCommittee>> findAllByActiveData() {
        return addMemberInCommitteeService.findAllByActiveData(true);
    }
}

