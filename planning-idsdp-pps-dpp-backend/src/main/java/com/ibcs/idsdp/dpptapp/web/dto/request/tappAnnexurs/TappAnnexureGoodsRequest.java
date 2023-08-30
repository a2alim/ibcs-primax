package com.ibcs.idsdp.dpptapp.web.dto.request.tappAnnexurs;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.TappAnnexureGoodsDetailDTO;
import lombok.Data;

import java.util.List;

@Data
public class TappAnnexureGoodsRequest extends UuidIdHolderRequestBodyDTO {
    private Double totalAmount;
    private Boolean status;
    private String formType;
    private String projectConceptUuid;

    List<TappAnnexureGoodsDetailsRequest> requestList;
    List<TappAnnexureGoodsDetailDTO> list;
}
