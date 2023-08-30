package com.ibcs.idsdp.rdpprtapp.web.dto.request.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rdpprtapp.model.domain.AnxFiveBAmount;
import com.ibcs.idsdp.rdpprtapp.model.domain.annexIII_aGoods.AnnexureGoodsDetails;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.AnnexureGoodsDetailsDto;
import lombok.Data;

import java.util.List;

@Data
public class AnnexureGoodsRequest extends UuidIdHolderRequestBodyDTO {

    private Double totalAmount;
    private Boolean status;
    private String formType;
    private Long dppMasterId;
    private Long projectConceptMasterId;
    private String projectConceptUuid;
    List<AnnexureGoodsDetailsRequest> requestList;
    List<AnnexureGoodsDetailsDto> list;

    AnxFiveBAmount anxFiveBAmount;
}
