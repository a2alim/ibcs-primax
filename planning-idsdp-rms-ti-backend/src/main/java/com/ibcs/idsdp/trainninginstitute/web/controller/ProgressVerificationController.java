package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.trainninginstitute.model.domain.ProgressVerificationModel;
import com.ibcs.idsdp.trainninginstitute.services.ProgressVerificationService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ProgressVerificationRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/progress-verification")
public class ProgressVerificationController {
    private final ProgressVerificationService progressVerificationService;

    @PostMapping
    public ResponseEntity<ApiMessageResponse> createProgressVerification(@RequestBody ProgressVerificationRequest progressVerificationRequest) {
        return progressVerificationService.createProgressVerification(progressVerificationRequest);
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<List<ProgressVerificationModel>>> getProgressVerification(@RequestParam(value = "page", defaultValue = "0") int page,
                                                                                                       @RequestParam(value = "size", defaultValue = "10") int size) {
        return progressVerificationService.getProgressVerification(page, size);
    }

    @PutMapping("/{progressVerificationId}")
    public ResponseEntity<ApiMessageResponse> editProgressVerification(@PathVariable("progressVerificationId") Long progressVerificationId,
                                                                       @RequestBody ProgressVerificationRequest progressVerificationRequest) {
        return progressVerificationService.editProgressVerification(progressVerificationId, progressVerificationRequest);
    }

    @DeleteMapping("/{progressVerificationId}")
    public ResponseEntity<ApiMessageResponse> deleteProgressVerification(@PathVariable("progressVerificationId") Long progressVerificationId) {
        return progressVerificationService.deleteProgressVerification(progressVerificationId);
    }

    @GetMapping("/{progressVerificationId}")
    public ResponseEntity<ProgressVerificationModel> getProgressVerificationById(@PathVariable("progressVerificationId") Long progressVerificationId) {
        return progressVerificationService.getProgressVerificationById(progressVerificationId);
    }
}
