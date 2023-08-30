package com.ibcs.idsdp.rpm.model.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.EligibilityChecker;

@Repository
public interface EligibilityCheckerRepository extends JpaRepository<EligibilityChecker, Long>{

}
