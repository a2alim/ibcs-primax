package com.ibcs.idsdp.projectconcept.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import lombok.Data;

@Data
public class MisQueryRequest {
    private int sectorDivisionId;
    private int sectorId;
    private int subSectorId;
    private int projectTypeId;

    private Double paAmountFrom;
    private Double paAmountTo;
    private Double gobAmountFrom;
    private Double gobAmountTo;
    private Double ownAmountFrom;
    private Double ownAmountTo;
    private Double totalAmountFrom;
    private Double totalAmountTo;

    private Boolean isFundingTypeGob;
    private Boolean isFundingTypeOwn;
    private Boolean isFundingTypeOther;
    private Boolean isFinancingTypeGob;
    private Boolean isFinancingTypePa;

    private String ministryName;
    private String agencyName;
    private String fiscalYearFrom;
    private String fiscalYearTo;

    private long divisionLocationId;
    private long zillaLocationId;
    private long upazilaLocationId;

    private Integer page;
    private Integer size;
}
