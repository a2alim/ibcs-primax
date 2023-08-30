package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class TappFinancingAndExpectationDTO extends UuidIdHolderRequestBodyDTO {

    private String pcUuid;
    private Long pcMasterId;
    private Double requiredAmount;
    private String sourceFinancing;
    private String modeFinancing;
    private String outcome;

}
