package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.NewMember;
import com.ibcs.idsdp.rpm.model.domain.PresentationEvaluatorsFeedback;
import com.ibcs.idsdp.rpm.model.domain.ResearcherPresentation;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;

@Repository
public interface PresentationEvaluatorsFeedbackRepository extends ServiceRepository<PresentationEvaluatorsFeedback> {

	List<PresentationEvaluatorsFeedback> findAllByResearcherProposalAndIsDeleted(ResearcherProposal researcherProposal,
			Boolean isDeleted);

	List<PresentationEvaluatorsFeedback> findAllByResearcherProposalIdAndIsNewAndIsDeleted(Long researcherProposalId,
			Boolean isNew, Boolean isDeleted);

	List<PresentationEvaluatorsFeedback> findAllByResearcherPresentationIdAndIsDeleted(Long researcherPresentationId,
			Boolean isDeleted);

	@Transactional
	@Modifying(clearAutomatically = true)
	@Query(value = "update m2_presentation_evaluators_feedback set is_visible =:isVisible where m1_researcher_proposal_id =:researcherProposal", nativeQuery = true)
	void updateIsVisible(Boolean isVisible, Long researcherProposal);

	List<PresentationEvaluatorsFeedback> findAllByResearcherPresentationInAndIsDeleted(
			List<ResearcherPresentation> researcherPresentation, Boolean isDeleted);

	List<PresentationEvaluatorsFeedback> findByResearcherPresentationAndResearcherProposalAndStProfileOfExpertEvaluatorsIdAndIsDeleted(
			ResearcherPresentation researcherPresentation, ResearcherProposal researcherProposal,
			Long stProfileOfExpertEvaluatorsId, Boolean isDeleted);

	List<PresentationEvaluatorsFeedback> findByResearcherPresentationAndResearcherProposalAndNewMemberAndIsDeleted(
			ResearcherPresentation researcherPresentation, ResearcherProposal researcherProposal, NewMember newMember,
			Boolean isDeleted);
}
