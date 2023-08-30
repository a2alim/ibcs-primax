package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.response.PresentationReportResponseDto;
import com.ibcs.idsdp.util.Response;

public interface PresentationReportService {
	
    Response<PresentationReportResponseDto> findByCreateSeminarUuid(String createSeminarUuid);
    Boolean seminarIsExists( Long seminarId);

}
