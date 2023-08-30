package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.response.EvaluatorNewMemberAttendanceResponseDto;
import com.ibcs.idsdp.util.Response;

public interface EvaluatorNewMemberAttendanceService {

	Response<EvaluatorNewMemberAttendanceResponseDto> findAllByResearcherProposalId(String uuid);
	Response<EvaluatorNewMemberAttendanceResponseDto> getByResearcherPresentationId(Long presentationId);

}
