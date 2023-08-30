package com.ibcs.idsdp.rpm.client.dto.response;

import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ZillaResponse extends UuidIdHolderRequestBodyDTO {

    private String code;
    private String geoCode;
    private Long divisionId;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;

    private DivisionResponse division;

    List<UpaZillaResponse> upaZillas;
}
