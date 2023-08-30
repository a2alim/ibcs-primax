package com.ibcs.idsdp.dpptapp.web.dto.request.tappAnnexurs;

import lombok.Data;

import java.util.List;

@Data
public class TappAnnexureGoodSaveWithChildRequest {
    private String uuid;
    private Double totalAmount;
    private String formType;
    private String projectConceptUuid;

    private List<TappAnnexureGoodsDetailsRequest> list;
}
