package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.AgreementInstallment;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcess;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstallmentProcessRepository extends ServiceRepository<InstallmentProcess> {

    List<InstallmentProcess> findByM1ResearcherProposalIdAndIsDeleted(ResearcherProposal m1ResearcherProposalId, boolean isDeleted);

    List<InstallmentProcess> findAllByM1ResearcherProposalIdAndIsDeleted(ResearcherProposal researcherProposal, boolean isDeleted);
}
