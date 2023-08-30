package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class UnitTypeRequest extends UuidIdHolderRequestBodyDTO {
    private String code;
    private String unitTypeNameEng;
    private String unitTypeNameBng;
    private String description;
    private Boolean status;
}
