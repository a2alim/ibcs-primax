package com.ibcs.idsdp.rdpprtapp.client.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class DivisionRequest extends UuidIdHolderRequestBodyDTO {

    private String code;
    private String geoCode;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;
    private Boolean checked;

    List<ZillaRequest> zillaList;
}
