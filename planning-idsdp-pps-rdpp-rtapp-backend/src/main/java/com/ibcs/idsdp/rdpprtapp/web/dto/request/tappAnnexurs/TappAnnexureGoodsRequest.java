package com.ibcs.idsdp.rdpprtapp.web.dto.request.tappAnnexurs;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rdpprtapp.model.domain.tappAnnexurs.TappAnnexureGoodsDetails;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.TappAnnexureGoodsDetailsDto;
import lombok.Data;

import java.util.List;

@Data
public class TappAnnexureGoodsRequest extends UuidIdHolderRequestBodyDTO {

    private Double totalAmount;
    private Boolean status;
    private String formType;
    private String projectConceptUuid;
    private Long rtappMasterId;

    List<TappAnnexureGoodsDetailsRequest> requestList;

    List<TappAnnexureGoodsDetailsDto> list;

}
