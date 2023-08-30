package com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.model.domain.annexIII_aGoods.AnnexureGoods;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProcurementMethod;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProcurementType;
import com.ibcs.idsdp.dpptapp.web.dto.response.UnitType;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.Date;

@Setter
@Getter
public class AnnexureGoodsDetailsRequest extends UuidIdHolderRequestBodyDTO {

    private Long annexureGoodsId;
    private String packageName;
    private String tappGoods;
    private Long unitId;
    private Double quantity;
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
    private AnnexureGoods annexureGoods;
    private UnitType unitTypeDTO;
    private ProcurementMethod procurementMethod;
    private ProcurementType procurementType;
}

