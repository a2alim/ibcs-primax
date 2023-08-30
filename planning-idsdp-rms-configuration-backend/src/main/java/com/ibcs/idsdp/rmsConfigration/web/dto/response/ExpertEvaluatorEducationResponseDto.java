package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class ExpertEvaluatorEducationResponseDto extends UuidIdHolderRequestBodyDTO {
    private Integer commonTypes;
    private String subject;
    private String universityOrInstitute;
    private String result;
    private String cgpa;


}
