package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.model.domain.ViewResearcherList;
import com.ibcs.idsdp.rpm.web.dto.response.ViewProfileProposalMarksResponse;
import com.ibcs.idsdp.rpm.web.dto.response.ViewResearcherDto;
import com.ibcs.idsdp.rpm.web.dto.response.ViewResearcherProposalResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.data.domain.Page;

public interface ViewResearcherService {

	Page<ViewResearcherList> criteriaBasedSearch(ViewResearcherList request);

	Response<ViewResearcherDto> findAllByStFiscalYearId(Long stFiscalYearId);

	Response<ViewResearcherList> findAllByStFiscalYearIdAndProfileId(ViewResearcherDto viewResearcherDto);

	Response<ViewResearcherDto> viewResercherProfile(String profileUuId);

	Response<ViewResearcherDto> viewResearcherProfileById(Long profileId);

	Response<ViewResearcherProposalResponse> getProposalByFiscalYearAndCategory(ViewResearcherList request);

	Response<ViewProfileProposalMarksResponse> getMarksByFiscalYear(ViewResearcherList request);

}
