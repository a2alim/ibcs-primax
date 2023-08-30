package com.ibcs.idsdp.projectconcept.client.dto.response;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.projectconcept.client.dto.SectorDivision;
import com.ibcs.idsdp.projectconcept.client.dto.response.Agency;
import com.ibcs.idsdp.projectconcept.client.dto.response.MinistryDivision;
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
