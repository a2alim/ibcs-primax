package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

@Data
public class UserGroupResponse extends BaseEntity {
    private Long userId;

    private Agency agency;

    private MinistryDivision ministryDivision;

    private SectorDivision sectorDivision;

    private String planningMinister;

    private String ecnec;

    private Boolean checked;
}
