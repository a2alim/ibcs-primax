package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.FiscalYearIdAndPageableRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.RmsEvaluatorsGrantAmountLetterResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface RmsEvaluatorsGrantAmountLetterService {

    Response<RmsEvaluatorsGrantAmountLetterResponseDto> getByFiscalYearId(FiscalYearIdAndPageableRequestDto requestDto);

    Response<RmsEvaluatorsGrantAmountLetterResponseDto> uploadDocById(Long id, Optional<MultipartFile> file);

    Response<RmsEvaluatorsGrantAmountLetterResponseDto> getByUuidWithADetails(String uuid);


}
