package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs.TappAnnexureGoods;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TappAnnexureGoodsDetailDTO {
    private Long id;
    private String uuid;
    private String packageName;
    private String tappGoods;
    private Long unitId;
    private Integer quantity;
    private Long procurementMethodId;
    private Long procurementTypeId;
    private String contractApproveAuthoriity;
    private String sourceOfFund;
    private Double estdCostAmount;
    private String invitationForTenderWork;
    private String packageDppTppService;
    private String invitationForEoi;
    private String issueOfRfp;
    private LocalDate invitationForTender;
    private LocalDate signingOfContract;
    private LocalDate completionOfContract;
    private UnitType unitType;
    private ProcurementMethod procurementMethod;
    private ProcurementType procurementType;
    private TappAnnexureGoods tappAnnexureGoods;
}
