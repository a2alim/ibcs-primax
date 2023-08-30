package com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class ProcurementPlanDetails {
    private String packageName;
    private String description;
    private String unitTypeCode;
    private Double quantity;
    private String procurementMethodCode;
    private String procurementTypeCode;
    private String contractApprovalAuthority;
    private String sourceOfFund;
    private Double estimatedCost;
    private LocalDate invitationForEoi;
//    private LocalDate issueOfRfp;
    private LocalDate invitationForTender;
    private LocalDate signingOfContract;
    private LocalDate completionOfContract;
}

