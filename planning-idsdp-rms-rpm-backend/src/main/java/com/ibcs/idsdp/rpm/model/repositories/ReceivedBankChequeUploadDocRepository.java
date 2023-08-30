package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ReceivedBankChequeUploadDoc;

@Repository
public interface ReceivedBankChequeUploadDocRepository extends ServiceRepository<ReceivedBankChequeUploadDoc> {

	List<ReceivedBankChequeUploadDoc> findAllByReceivedBankChequeIdAndIsDeleted(Long receivedBankChequeId, Boolean isDeleted);
}
