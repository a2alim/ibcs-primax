package com.ibcs.idsdp.projectconcept.client.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class ZillaRequest extends UuidIdHolderRequestBodyDTO {

    private String code;
    private String geoCode;
    private Long divisionId;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;
    private Boolean checked;

    private DivisionRequest division;

    List<UpaZillaRequest> upaZillaList;
}
