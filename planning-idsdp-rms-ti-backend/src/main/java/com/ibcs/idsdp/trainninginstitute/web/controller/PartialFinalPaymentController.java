package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.trainninginstitute.enums.Status;
import com.ibcs.idsdp.trainninginstitute.model.domain.PartialFinalPaymentModel;
import com.ibcs.idsdp.trainninginstitute.services.PartialFinalPaymentService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.PartialFinalPaymentRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.*;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/partial-final-payment")
public class PartialFinalPaymentController {
	
    private final PartialFinalPaymentService partialFinalPaymentService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Long>> createPartialFinalPayment(@RequestBody PartialFinalPaymentRequest partialFinalPaymentRequest) {
        return partialFinalPaymentService.createPartialFinalPayment(partialFinalPaymentRequest);
    }

    @GetMapping()
    public ResponseEntity<PaginationResponse<List<PartialFinalPaymentResponse>>> getPartialFinalPayments(@RequestParam(value = "page", defaultValue = "0") int page,
                                                                                                         @RequestParam(value = "size", defaultValue = "10") int size) {
        return partialFinalPaymentService.getPartialFinalPayments(page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartialFinalPaymentModel> getSinglePartialFinalPayment(@PathVariable("id") Long id) {
        return partialFinalPaymentService.getSinglePartialFinalPayment(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiMessageResponse> deletePartialFinalPayment(@PathVariable("id") Long id) {
        return partialFinalPaymentService.deletePartialFinalPayment(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiMessageResponse> updatePartialFinalPayment(@PathVariable("id") Long id, @RequestBody PartialFinalPaymentRequest partialFinalPaymentRequest) {
        return partialFinalPaymentService.updatePartialFinalPayment(id, partialFinalPaymentRequest);
    }

    @PutMapping("/change-status/{id}")
    public ResponseEntity<ApiMessageResponse> changeStatus(@PathVariable Long id, @RequestParam Status status) {
        return partialFinalPaymentService.changeStatus(id, status);
    }

    @GetMapping("/previous-payments/{proposalId}")
    public ResponseEntity<List<PreviousPaymentResponse>> getPreviousPayments(@PathVariable Long proposalId) {
        return partialFinalPaymentService.getPreviousPayments(proposalId);
    }

}
