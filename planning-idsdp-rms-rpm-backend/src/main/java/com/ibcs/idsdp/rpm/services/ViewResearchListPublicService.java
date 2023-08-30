package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.model.domain.ViewResearchFinalSubmissionReport;
import org.springframework.data.domain.Page;

import com.ibcs.idsdp.rpm.model.domain.ViewResearchListPublic;
import com.ibcs.idsdp.util.Response;

public interface ViewResearchListPublicService {
	
	
	Page<ViewResearchListPublic> criteriaBasedSearch(ViewResearchListPublic request);

	Page<ViewResearchFinalSubmissionReport> findByUserKeyWords(ViewResearchFinalSubmissionReport request);
//
//	Response<ViewResearcherDto> findAllByStFiscalYearId(Long stFiscalYearId);
//
//	Response<ViewResearcherList> findAllByStFiscalYearIdAndProfileId(ViewResearcherDto viewResearcherDto);
//
//	Response<ViewResearcherDto> viewResercherProfile(String profileUuId);
//
//	Response<ViewResearcherDto> viewResearcherProfileById(Long profileId);
//
//	Response<ViewResearcherProposalResponse> getProposalByFiscalYearAndCategory(ViewResearcherList request);
//
//	Response<ViewProfileProposalMarksResponse> getMarksByFiscalYear(ViewResearcherList request);
	
	Response<ViewResearchListPublic> findByKeyWord(ViewResearchListPublic request);



}
