package com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.model.domain.AnxFiveBAmount;
import com.ibcs.idsdp.dpptapp.model.domain.annexIII_aGoods.AnnexureGoodsDetails;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

@Data
public class AnnexureGoodsRequest extends UuidIdHolderRequestBodyDTO {

    private Double totalAmount;
    private Boolean status;
    private String formType;
    private Long dppMasterId;
    private Long projectConceptMasterId;
    private String projectConceptUuid;
    List<AnnexureGoodsDetailsRequest> requestList;
    List<AnnexureGoodsDetailsRequest> list;

    AnxFiveBAmount anxFiveBAmount;
}
