package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class UpaZillaRequest extends UuidIdHolderRequestBodyDTO {
    private String code;
    private String geoCode;
    private Long zillaId;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;

    ZillaRequest zilla;

    List<MunicipalityRequest> municipalitys;
}
