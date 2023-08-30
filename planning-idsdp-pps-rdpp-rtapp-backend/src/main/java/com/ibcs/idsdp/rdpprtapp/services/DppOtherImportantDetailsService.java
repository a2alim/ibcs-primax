package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.model.domain.DppOtherImportantDetails;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppOtherImportantDetailsRequest;

public interface DppOtherImportantDetailsService {

    public Boolean saveOtherImportantDetails(DppOtherImportantDetailsRequest dppOtherImportantDetailsRequest);

    public DppOtherImportantDetailsRequest getOtherImportantDetailsByUuid(String uuid);

    public DppOtherImportantDetails getOtherImportantDetailsByProjectId(String projectId);

    public DppOtherImportantDetailsRequest updateOtherImportantDetails(DppOtherImportantDetailsRequest otherImportantDetailsRequest, String id);
}
