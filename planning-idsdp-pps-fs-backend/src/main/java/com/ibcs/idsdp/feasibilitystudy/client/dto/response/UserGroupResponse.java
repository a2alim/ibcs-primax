package com.ibcs.idsdp.feasibilitystudy.client.dto.response;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.feasibilitystudy.client.dto.SectorDivision;
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
