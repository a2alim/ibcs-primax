package com.ibcs.idsdp.rpm.model.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ReceivedBankCheque;

@Repository
public interface ReceivedBankChequeRepository extends ServiceRepository<ReceivedBankCheque> {

	Page<ReceivedBankCheque> findAllReceivedBankChequeByIsDeleted(boolean isDeleted, Pageable pageable);

	Page<ReceivedBankCheque> findAllByIsDeletedAndFiscalYearId(boolean isDeleted, Long fiscalYearId, Pageable pageable);

	Page<ReceivedBankCheque> findAllByIsDeletedAndFiscalYearIdAndResearcherProposalId(boolean isDeleted,
			Long fiscalYearId, Long researcherProposalId, Pageable pageable);

	Page<ReceivedBankCheque> findAllByIsDeletedAndFiscalYearIdAndResearchCatTypeId(boolean isDeleted, Long fiscalYearId,
			Long researchCatTypeId, Pageable pageable);

	Page<ReceivedBankCheque> findAllByIsDeletedAndFiscalYearIdAndResearcherProposalIdAndResearchCatTypeId(
			boolean isDeleted, Long fiscalYearId, Long researcherProposalId, Long researchCatTypeId, Pageable pageable);
}
