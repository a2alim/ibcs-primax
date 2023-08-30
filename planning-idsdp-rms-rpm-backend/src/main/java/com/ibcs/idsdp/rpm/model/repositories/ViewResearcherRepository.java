package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ViewResearcherList;
import com.ibcs.idsdp.rpm.web.dto.response.ViewResearcherDto;

public interface ViewResearcherRepository extends JpaRepository<ViewResearcherList, Long> {

//	@Query(value = "select " + "	r_proposal.id as proposal_id, " + "	r_proposal.uuid as proposal_uuid, "
//			+ "	r_proposal.researcher_profile_personal_info_master_id," + "	r_proposal.research_title ,"
//			+ "	r_proposal.st_fiscal_year_id ," + "	r_proposal.res_profile_personal_info_id,"
//			+ "	r_profile.id as profile_id," + "	r_profile.uuid as profile_uuid,	" + "	r_profile.user_id ,	"
//			+ "	r_profile.is_deleted" + " from" + "	m1_researcher_profile_personal_info r_profile"
//			+ " right join m1_researcher_proposal r_proposal on"
//			+ "	r_profile.id = r_proposal.researcher_profile_personal_info_master_id"
//			+ " where r_profile.is_deleted= false and r_proposal.st_fiscal_year_id = ?", nativeQuery = true)

	List<ViewResearcherList> findAllByStFiscalYearId(Long stFiscalYearId);

	List<ViewResearcherList> findAllByStFiscalYearIdAndIsDeleted(Long stFiscalYearId, Boolean isDeleted);

	List<ViewResearcherList> findAllByStFiscalYearIdAndProfileIdAndIsDeleted(Long stFiscalYearId, Long profileId, Boolean isDeleted);

	List<ViewResearcherList> findAllByProfileIdAndIsDeleted(Long profileId, Boolean isDeleted);

	List<ViewResearcherList> findAllByIsDeleted(Boolean isDeleted);
	Optional<ViewResearcherList> findByStFiscalYearIdAndStResearchCatTypeIdAndStSectorTypeIdAndResearchTitleAndUserIdAndIsFinalSubmitAndIsDeleted(
			Long stFiscalYearId, Long stResearchCatTypeId, Long stSectorTypeId, String researchTitle, Long userId, boolean isFinalSubmit, boolean isDeleted);

}
