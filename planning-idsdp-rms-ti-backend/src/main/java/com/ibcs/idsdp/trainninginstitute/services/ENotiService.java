package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.ENothiModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.UploadENothiRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ENotiService {
    ResponseEntity<ApiMessageResponse> uploadENothi(UploadENothiRequest uploadENothiRequest);

    ResponseEntity<ApiMessageResponse> deleteENothi(Long enothiId);

    ResponseEntity<PaginationResponse<List<ENothiModel>>> getENothi(int pageNo, int pageSize, Long fiscalYearId);
}
