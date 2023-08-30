package com.ibcs.idsdp.rpm.client.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

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

    ZillaResponse zilla;

//    List<MunicipalityRequest> municipalitys;
}
