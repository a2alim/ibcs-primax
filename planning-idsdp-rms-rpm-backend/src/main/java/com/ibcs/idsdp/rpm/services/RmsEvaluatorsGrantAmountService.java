package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.RmsEvaluatorsGrantAmountRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.RmsEvaluatorsGrantAmountResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;

public interface RmsEvaluatorsGrantAmountService {

    Response<RmsEvaluatorsGrantAmountResponseDto> getByRmsEvaluatorsGrantAmountLetterId(Long rmsEvaluatorsGrantAmountLetterId);

    Response<RmsEvaluatorsGrantAmountResponseDto> saveList(List<RmsEvaluatorsGrantAmountRequestDto> request);

}
