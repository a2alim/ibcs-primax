package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.CompletionReportModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.CompletionReportRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.CompletionReportResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CompletionReportService {
	
    ResponseEntity<ApiMessageResponse> createCompletionReport(CompletionReportRequest completionReportRequest);

    ResponseEntity<PaginationResponse<List<CompletionReportResponse>>> getAllCompletionReports(int pageNo, int pageSize);

    ResponseEntity<ApiMessageResponse> updateCompletionReport(Long completionReportId, CompletionReportRequest completionReportRequest);

    ResponseEntity<ApiMessageResponse> deleteCompletionReport(Long completionReportId);

    ResponseEntity<CompletionReportModel> getCompletionReport(Long completionReportId);
}
