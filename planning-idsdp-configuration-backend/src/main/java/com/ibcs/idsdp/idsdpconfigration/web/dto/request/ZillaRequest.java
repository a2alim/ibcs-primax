package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.UpaZilla;
import lombok.Data;

import java.util.List;

@Data
public class ZillaRequest extends UuidIdHolderRequestBodyDTO {

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
