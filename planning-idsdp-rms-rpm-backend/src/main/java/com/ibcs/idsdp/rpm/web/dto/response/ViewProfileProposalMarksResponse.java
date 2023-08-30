package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.rpm.client.dto.response.*;
import lombok.Data;

@Data
public class ViewProfileProposalMarksResponse {

    private Long proposalId;

    private String proposalUuid;

    private Long researcherProfilePersonalInfoMasterId;

    private Long stResearchCatTypeId;

    private Long fiscalYearId;

    private Long userId;

    private Double profileMarks;

    private Double proposalMarks;

    private Long divisionId;

    private Long districtId;

    private Long upzilaId;

    private Long preDivisionId;

    private Long preDistrictId;

    private Long preUpzilaId;

    private UserResponse userDto;

    private ResearchCategoryTypeResponseDto researchCategoryType;

    private FiscalResponseDto fiscalYearDto;

    private DivisionResponse divisionDto;

    private ZillaResponse districtDto;

    private UpaZillaResponse upzilaDto;

    private DivisionResponse preDivisionDto;

    private ZillaResponse preDistrictDto;

    private UpaZillaResponse preUpzilaDto;

    //added by Rakib for report
    private String stResearchCat;
}
