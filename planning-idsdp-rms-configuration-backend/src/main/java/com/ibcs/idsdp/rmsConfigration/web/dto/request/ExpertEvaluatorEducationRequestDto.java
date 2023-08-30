package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class ExpertEvaluatorEducationRequestDto {

    private Long eudcationLevel;
    private String subject;
    private String universityOrInstitute;
    private String result;
}
