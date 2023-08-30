package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class ExpenditureCostDTO extends UuidIdHolderRequestBodyDTO {

    private Long economicCodeId;

    private Long economicSubCodeId;

    private String description;

    private Double totalAmount;

    private Double gobAmount;

    private Double feGobAmount;

    private Double paAmount;

    private Double rpaAmount;

    private Double rpaGobAmount;

    private Double rpaSpecialAccountAmount;

    private Double dpaAmount;

    private Double dpaThroughPdAmount;

    private Double dpaDpAmount;

    private Double ownFundAmount;

    private Double feOwnFundAmount;

    private Double othersAmount;

    private Double othersFeAmount;

    private Long fspMasterId;
}
