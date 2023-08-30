package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.rdpprtapp.model.domain.tappAnnexurs.TappAnnexureGoods;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TappAnnexureGoodsDetailsDto {
    private Long id;

    private String uuid;

    private TappAnnexureGoods tappAnnexureGoods;

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

    private ProcurementTypeResponse procurementType;

    private  ProcurementMethodResponse procurementMethod;
}
