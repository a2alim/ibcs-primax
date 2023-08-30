package com.ibcs.idsdp.projectconcept.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ModeOfFinanceDTO extends UuidIdHolderRequestBodyDTO {

    private Long modeId;
    private Double totalAmount;
    private Double gobAmount;
    private Double feGobAmount;
    private Double ownFundAmount;
    private Double feOwnFundAmount;
    private Double paAmount;
    private Double rpaAmount;
    private Double dpaAmount;
    private Double otherAmount;
    private Double feOtherAmount;
    private Long projectConceptMasterId;

}
