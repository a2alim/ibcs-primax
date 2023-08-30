package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.model.domain.FinalEvaluationReport;
import com.ibcs.idsdp.rpm.web.dto.request.FinalEvaluationReportRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.FinalEvaluationReportResponseDto;
import com.ibcs.idsdp.util.Response;

public interface FinalEvaluationReportService {

    Response<FinalEvaluationReportResponseDto> createOrUpdate(FinalEvaluationReportRequestDto finalEvaluationReportRequestDto);

    Response<FinalEvaluationReport> findAll(boolean isDeleted, boolean isActive);

}
