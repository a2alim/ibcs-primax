package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.AddMemberInCommittee;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.AddMemberInCommitteeRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.AddMemberInCommitteeResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AddMemberInCommitteeService {
    Response<AddMemberInCommitteeResponse> dataSave(AddMemberInCommitteeRequest addMemberInCommitteeRequest);
    Response<AddMemberInCommitteeResponse> dataUpdate(AddMemberInCommitteeRequest addMemberInCommitteeRequest);

    ResponseEntity<List<AddMemberInCommittee>> findAllByActiveData(Boolean active);
}
