package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.AgreementInstallment;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgreementInstallmentRepository extends ServiceRepository<AgreementInstallment> {

    List<AgreementInstallment> findByAgreementWithResearcherId(AgreementWithResearcher agreementId);

    List<AgreementInstallment> findAllByAgreementWithResearcherId(AgreementWithResearcher agreement);
    
    
}
