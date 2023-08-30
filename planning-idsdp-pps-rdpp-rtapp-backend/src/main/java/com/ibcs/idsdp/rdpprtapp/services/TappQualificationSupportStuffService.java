package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.TappQualificationSupportStuffRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.TappQualificationSupportStuffResponse;

public interface TappQualificationSupportStuffService {

    TappQualificationSupportStuffRequest createSupportStuff(TappQualificationSupportStuffRequest qualificationSupportStuffRequest);

    ResponseWithResults getQualificationSupportStuff(String pcUuid);

    TappQualificationSupportStuffResponse updateSupportStuff(TappQualificationSupportStuffResponse request, String pcUuid);
}
