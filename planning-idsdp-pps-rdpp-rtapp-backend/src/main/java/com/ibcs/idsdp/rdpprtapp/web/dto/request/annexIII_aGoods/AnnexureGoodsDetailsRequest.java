package com.ibcs.idsdp.rdpprtapp.web.dto.request.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class AnnexureGoodsDetailsRequest extends UuidIdHolderRequestBodyDTO {

    private Long annexureGoodsId;
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
    private LocalDate invitationForEoi;
    private String issueOfRfp;
    private LocalDate invitationForTender;
    private LocalDate signingOfContract;
    private LocalDate completionOfContract;
}

