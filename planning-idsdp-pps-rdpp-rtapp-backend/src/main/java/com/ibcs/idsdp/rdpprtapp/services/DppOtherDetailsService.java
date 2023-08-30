package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.model.domain.DppOtherDetails;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppOtherDetailsRequest;

public interface DppOtherDetailsService {
    public Boolean saveDppOtherDetails(DppOtherDetailsRequest dppOtherDetailsRequest);

    public DppOtherDetailsRequest getOtherDetailsByUuid(String uuid);

    public DppOtherDetails getOtherDetailsByProjectId(String projectId);

    public DppOtherDetailsRequest updateOtherDetails(DppOtherDetailsRequest otherDetailsRequest, String id);
}
