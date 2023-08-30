package com.ibcs.idsdp.idsdpconfigration.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Agency;
import com.ibcs.idsdp.idsdpconfigration.model.domain.MinistryDivision;
import lombok.Data;

import javax.persistence.OneToOne;

@Data
public class UserGroupDTO extends UuidIdHolderRequestBodyDTO {
    private Long userId;

    private Long agency;

    private Long ministry;

    private Long sectorDivison;

    private Boolean checked;

    private String planningMinister;

    private String ecnec;
}
