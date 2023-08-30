package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.AgreementParty;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgreementPartyRepository extends ServiceRepository<AgreementParty> {

    Optional<AgreementParty> findByAgreementWithResearcherId(AgreementWithResearcher agreement);
}
