package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.IdentityResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.dpptapp.model.domain.TappAnnexureThree;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappAnnexureThreeDetailsRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappAnnexureThreeRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TappAnnexureThreeService {

    ResponseEntity<IdentityResponse> createConsultant(List<TappAnnexureThreeDetailsRequest> consultantDetailsRequest);

    TappAnnexureThreeRequest updateConsultant(TappAnnexureThreeRequest request);

    TappAnnexureThreeRequest getAnnexureThree(String uuid);

    ResponseEntity<ResponseStatus> deleteRow(String uuid);
}
