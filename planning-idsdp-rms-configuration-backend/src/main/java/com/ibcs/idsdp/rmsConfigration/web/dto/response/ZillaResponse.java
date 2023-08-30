package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.DivisionRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.UpaZillaRequest;

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

    private DivisionRequest division;

    List<UpaZillaRequest> upaZillas;
}
