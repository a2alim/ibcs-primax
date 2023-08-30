package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class UnitType extends UuidIdHolderRequestBodyDTO {
    private String code;
    private String unitTypeNameEng;
    private String unitTypeNameBng;
    private String description;
    private Boolean status;
}
