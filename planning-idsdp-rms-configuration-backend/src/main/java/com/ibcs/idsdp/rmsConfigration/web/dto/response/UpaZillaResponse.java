package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ZillaRequest;

import lombok.Data;

@Data
public class UpaZillaResponse extends UuidIdHolderRequestBodyDTO {
	
    private String code;
    private String geoCode;
    private Long zillaId;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;

    ZillaRequest zilla;

//    List<MunicipalityRequest> municipalitys;
}
