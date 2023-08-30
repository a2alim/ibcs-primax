package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.model.domain.DppOtherDetails;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppOtherDetailsRequest;

public interface DppOtherDetailsService {
    public Boolean saveDppOtherDetails(DppOtherDetailsRequest dppOtherDetailsRequest);

    public DppOtherDetailsRequest getOtherDetailsByUuid(String uuid);

    public DppOtherDetails getOtherDetailsByProjectId(String projectId);

    public DppOtherDetailsRequest updateOtherDetails(DppOtherDetailsRequest otherDetailsRequest, String id);
}
