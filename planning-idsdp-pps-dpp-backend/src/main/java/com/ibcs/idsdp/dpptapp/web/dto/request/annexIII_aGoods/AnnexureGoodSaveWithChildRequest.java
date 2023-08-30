package com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class AnnexureGoodSaveWithChildRequest extends  UuidIdHolderRequestBodyDTO{

    private Double totalAmount;
    private String formType;
    private Boolean status;
    private Long dppMasterId;
    //private Long projectConceptMasterId;
    private String projectConceptUuid;
    private List<AnnexureGoodsDetailsRequest> list;
}
