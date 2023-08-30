package com.ibcs.idsdp.idsdpconfigration.web.dto.request.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

import java.math.BigInteger;
import java.util.Date;

@Setter
@Getter
public class AnnexureGoodsDetailsRequest extends UuidIdHolderRequestBodyDTO {

    private long annexureGoodsId;
    private String packageName;
    private String tappGoods;
    private Long unitId;
    private Double quantity;
    private BigInteger procurementMethodId;
    private BigInteger procurementTypeId;
    private String contractApproveAuthoriity;
    private String sourceOfFund;
    private Double estdCost;
    private String invitationForTenderWork;
    private String packageDppTppService;
    private String invitationForEoi;
    private String issueOfRfp;
    private Date invitationForTender;
    private Date signingOfContract;
    private Date completionOfContract;
}

