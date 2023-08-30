package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.ProgressVerificationModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ProgressVerificationRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProgressVerificationService {
    ResponseEntity<ApiMessageResponse> createProgressVerification(ProgressVerificationRequest progressVerificationRequest);

    ResponseEntity<PaginationResponse<List<ProgressVerificationModel>>> getProgressVerification(int page, int size);

    ResponseEntity<ApiMessageResponse> editProgressVerification(Long progressVerificationId, ProgressVerificationRequest progressVerificationRequest);

    ResponseEntity<ApiMessageResponse> deleteProgressVerification(Long progressVerificationId);

    ResponseEntity<ProgressVerificationModel> getProgressVerificationById(Long progressVerificationId);
}
