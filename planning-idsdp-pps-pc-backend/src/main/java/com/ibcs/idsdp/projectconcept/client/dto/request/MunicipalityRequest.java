package com.ibcs.idsdp.projectconcept.client.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class MunicipalityRequest extends UuidIdHolderRequestBodyDTO {
    private String nameEn;
    private String nameBn;
    private String code;
    private String geoCode;
    private String description;
    private Boolean status;
    private Long upazilaId;
    private Boolean checked;

    private UpaZillaRequest upaZilla;
}
