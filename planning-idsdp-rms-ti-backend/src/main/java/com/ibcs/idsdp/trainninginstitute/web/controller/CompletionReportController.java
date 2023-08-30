package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.trainninginstitute.model.domain.CompletionReportModel;
import com.ibcs.idsdp.trainninginstitute.services.CompletionReportService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.CompletionReportRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.CompletionReportResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/completion-reports")
public class CompletionReportController{
	
    private final CompletionReportService completionReportService;

    @PostMapping
    public ResponseEntity<ApiMessageResponse> createCompletionReport(@RequestBody CompletionReportRequest completionReportRequest) {
        return completionReportService.createCompletionReport(completionReportRequest);
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<List<CompletionReportResponse>>> getAllCompletionReports(@RequestParam(defaultValue = "0") int pageNo,
                                                                                                      @RequestParam(defaultValue = "10") int pageSize) {
        return completionReportService.getAllCompletionReports(pageNo, pageSize);
    }

    @PutMapping("/{completionReportId}")
    public ResponseEntity<ApiMessageResponse> updateCompletionReport(@PathVariable("completionReportId") Long completionReportId,
                                                                     @RequestBody CompletionReportRequest completionReportRequest) {
        return completionReportService.updateCompletionReport(completionReportId, completionReportRequest);
    }

    @DeleteMapping("/{completionReportId}")
    public ResponseEntity<ApiMessageResponse> deleteCompletionReport(@PathVariable("completionReportId") Long completionReportId) {
        return completionReportService.deleteCompletionReport(completionReportId);
    }

    @GetMapping("/{completionReportId}")
    public ResponseEntity<CompletionReportModel> getCompletionReport(@PathVariable("completionReportId") Long completionReportId) {
        return completionReportService.getCompletionReport(completionReportId);
    }
}
