package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.enums.Status;
import com.ibcs.idsdp.trainninginstitute.model.domain.PartialFinalPaymentModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.PartialFinalPaymentRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PartialFinalPaymentService {
    ResponseEntity<ApiResponse<Long>>createPartialFinalPayment(PartialFinalPaymentRequest partialFinalPaymentRequest);

    ResponseEntity<PaginationResponse<List<PartialFinalPaymentResponse>>> getPartialFinalPayments(int page, int size);

    ResponseEntity<PartialFinalPaymentModel> getSinglePartialFinalPayment(Long id);

    ResponseEntity<ApiMessageResponse> deletePartialFinalPayment(Long id);

    ResponseEntity<ApiMessageResponse> updatePartialFinalPayment(Long id, PartialFinalPaymentRequest partialFinalPaymentRequest);

    ResponseEntity<ApiMessageResponse> changeStatus(Long id, Status status);

    ResponseEntity<List<PreviousPaymentResponse>> getPreviousPayments(Long proposalId);
}
