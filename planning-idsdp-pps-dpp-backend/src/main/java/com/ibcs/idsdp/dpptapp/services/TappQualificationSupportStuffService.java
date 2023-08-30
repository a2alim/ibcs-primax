package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.TappSupportStuff;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappQualificationSupportStuffRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.TappQualificationSupportStuffResponse;
import org.springframework.http.ResponseEntity;

public interface TappQualificationSupportStuffService {

    TappQualificationSupportStuffRequest createSupportStuff(TappQualificationSupportStuffRequest qualificationSupportStuffRequest);

    ResponseWithResults getQualificationSupportStuff(String pcUuid);

    TappQualificationSupportStuffResponse updateSupportStuff(TappQualificationSupportStuffResponse request, String pcUuid);
}
