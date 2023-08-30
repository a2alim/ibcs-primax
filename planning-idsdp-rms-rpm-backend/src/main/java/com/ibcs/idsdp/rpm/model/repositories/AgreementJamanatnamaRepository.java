package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.AgreementInstallment;
import com.ibcs.idsdp.rpm.model.domain.AgreementJamanatnama;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgreementJamanatnamaRepository extends ServiceRepository<AgreementJamanatnama> {

    Optional<AgreementJamanatnama> findByAgreementWithResearcherId(AgreementWithResearcher agreement);


}
