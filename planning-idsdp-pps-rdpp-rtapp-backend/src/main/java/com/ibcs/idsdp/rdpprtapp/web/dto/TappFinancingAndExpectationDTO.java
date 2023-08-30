package com.ibcs.idsdp.rdpprtapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class TappFinancingAndExpectationDTO extends UuidIdHolderRequestBodyDTO {

    private String pcUuid;
    private Long pcMasterId;
    private Double requiredAmount;
    private Double sourceFinancing;
    private String modeFinancing;
    private String outcome;

}
