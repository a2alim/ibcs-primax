package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;

@Repository
public interface AgreementWithResearcherRepository extends ServiceRepository<AgreementWithResearcher>{

    AgreementWithResearcher findByUuid(String uuid);

    AgreementWithResearcher findByResearcherProposalId(ResearcherProposal researcherProposal);

    List<AgreementWithResearcher> findAllByResearcherProposalIdAndIsDeleted(ResearcherProposal researcherProposalId, boolean isDeleted);

    List<AgreementWithResearcher> findAllByApprovalStatusAndIsDeleted(Integer id, boolean isDeleted);

    //List<AgreementWithResearcher> findAllByApprovalStatusAndIsDeletedAndSt(Integer id, boolean isDeleted);
}
