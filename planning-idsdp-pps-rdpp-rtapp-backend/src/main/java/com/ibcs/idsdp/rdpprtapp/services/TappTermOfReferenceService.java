package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.TappTermOfReferenceRequest;
import org.springframework.http.ResponseEntity;

public interface TappTermOfReferenceService {

    ResponseEntity<TappTermOfReferenceRequest> saveTermOfReference(TappTermOfReferenceRequest termOfReferenceRequest);

    ResponseWithResults getReferenceByProjectId(String id);

    TappTermOfReferenceRequest updateReference(TappTermOfReferenceRequest referenceRequest, String id);

}
