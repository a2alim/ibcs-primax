package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.enums.Status;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PartialFinalPaymentNewResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PreviousPaymentResponse;
import com.ibcs.idsdp.util.Response;

public interface PartialFinalPaymentNewService {

	Response<PreviousPaymentResponse> getPreviousPayments(Long proposalId);

	Response<PartialFinalPaymentNewResponseDto> gridList(PageableRequestBodyDTO requestBodyDTO, Long traningInsId);

	Response<PartialFinalPaymentNewResponseDto> changeStatus(Long id, Status status);

}
