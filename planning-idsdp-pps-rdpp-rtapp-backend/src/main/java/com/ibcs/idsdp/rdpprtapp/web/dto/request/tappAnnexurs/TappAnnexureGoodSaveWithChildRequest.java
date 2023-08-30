package com.ibcs.idsdp.rdpprtapp.web.dto.request.tappAnnexurs;

import lombok.Data;

import java.util.List;

@Data
public class TappAnnexureGoodSaveWithChildRequest {
    private String uuid;
    private Double totalAmount;
    private String formType;
    private String projectConceptUuid;
    private Long rtappMasterId;

    private List<TappAnnexureGoodsDetailsRequest> list;
}
