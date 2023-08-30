package com.ibcs.idsdp.rdpprtapp.web.dto.request.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class AnnexureGoodSaveWithChildRequest extends  UuidIdHolderRequestBodyDTO{

    private Double totalAmount;
    private String formType;
    private Boolean status;
    private Long dppMasterId;
    private Long rdppMasterId;
    private String projectConceptUuid;
    private List<AnnexureGoodsDetailsRequest> list;
}
