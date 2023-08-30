package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class CurrencyRequest extends UuidIdHolderRequestBodyDTO {

    private String generatedCode;
    private String code;
    private String nameEn;
    private String nameBn;
    private String country;
    private String description;
    private Boolean status;

}
