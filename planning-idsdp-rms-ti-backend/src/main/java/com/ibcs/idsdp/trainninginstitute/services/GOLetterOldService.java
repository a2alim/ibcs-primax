package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.GOLetterOldModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.GOLetterOldRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import org.springframework.http.ResponseEntity;

public interface GOLetterOldService {
    ResponseEntity<ApiMessageResponse> createGOLetter(GOLetterOldRequest goLetterRequest);

    ResponseEntity<GOLetterOldModel> getGOLetter(Long id);

    ResponseEntity<ApiMessageResponse> updateGOLetter(Long id, GOLetterOldRequest goLetterRequest);
}
