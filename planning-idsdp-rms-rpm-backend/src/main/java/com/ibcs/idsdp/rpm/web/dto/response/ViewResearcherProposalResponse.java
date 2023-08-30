package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.rpm.client.dto.response.*;
import lombok.Data;

@Data
public class ViewResearcherProposalResponse {

    private Long proposalId;

    private String proposalUuid;

    private Long researcherProfilePersonalInfoMasterId;

    private Long fiscalYearId;

    private Long stResearchCatTypeId;

    private Long stSectorTypeId;

    private String researchTitle;

    private Long userId;

	private Long divisionId;

	private Long districtId;

	private Long upzilaId;

	private Long preDivisionId;

	private Long preDistrictId;

	private Long preUpzilaId;

    private UserResponse userDto;

    private ResearchCategoryTypeResponseDto researchCategoryType;

    private DivisionResponse divisionDto;

    private ZillaResponse districtDto;

    private UpaZillaResponse upzilaDto;

    private DivisionResponse preDivisionDto;

    private ZillaResponse preDistrictDto;

    private UpaZillaResponse preUpzilaDto;

    private FiscalResponseDto fiscalYearDto;
}
