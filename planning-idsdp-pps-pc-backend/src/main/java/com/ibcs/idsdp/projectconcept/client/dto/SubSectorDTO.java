package com.ibcs.idsdp.projectconcept.client.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class SubSectorDTO extends UuidIdHolderRequestBodyDTO {
    private String code;
    private String subSectorCode;
    private String subSectorNameEn;
    private String subSectorNameBn;
    private String description;
    private Boolean status;
    private Long sectorId;
}
