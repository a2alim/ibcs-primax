package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class SectorDivision extends UuidIdHolderRequestBodyDTO {

    private String code;
    private String sectorDivisionCode;
    private String sectorDivisionNameEn;
    private String sectorDivisionNameBn;
    private String description;
    private Boolean status;
}
