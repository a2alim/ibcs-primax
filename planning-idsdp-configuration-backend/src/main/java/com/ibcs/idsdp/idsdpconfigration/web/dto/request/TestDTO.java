package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TestDTO extends UuidIdHolderRequestBodyDTO {

    private String code;
    private String nameEn;
    private String nameBn;
    private String shortName;
    private String description;
    private String status;
    private Boolean isDeleted;
}
