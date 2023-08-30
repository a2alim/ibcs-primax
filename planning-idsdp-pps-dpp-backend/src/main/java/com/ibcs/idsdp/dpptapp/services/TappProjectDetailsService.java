package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.TappProjectDetails;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappProjectDetailsRequest;

public interface TappProjectDetailsService {

    /**
     * For create tapp project details records
     * @param tappProjectDetailsRequest
     * @return
     */
    ResponseStatus save(TappProjectDetailsRequest tappProjectDetailsRequest);

    /**
     * For get tapp project details records
     * @return
     */
    TappProjectDetails getFirstRowData ();

    ResponseWithResults getProjectDetailsData(String pcUuid);

    ResponseStatus updateProjectDetails(TappProjectDetailsRequest request, String pcUuid);
}
