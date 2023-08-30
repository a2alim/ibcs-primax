package com.ibcs.idsdp.dpptapp.web.dto.request.tappAnnexurs;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.Date;

@Setter
@Getter
public class TappAnnexureGoodsDetailsRequest {

    private String uuid;
    private long tappAnnexureGoodsId;
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
}

