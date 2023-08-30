package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.AddMemberInCommittee;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.http.ResponseEntity;

import javax.persistence.QueryHint;
import java.util.List;
import java.util.Optional;

public interface AddMemberInCommitteeRepository extends ServiceRepository<AddMemberInCommittee> {
    @QueryHints(@QueryHint(value = "true", name = org.hibernate.annotations.QueryHints.CACHEABLE))

    long countByStFiscalYearIdAndStCommitteeTypeIdAndUserIdAndIsDeleted(Long stFiscalYearId, Long stCommitteeTypeId, Long userId, Boolean isDeleted);

    Optional<AddMemberInCommittee> findByStFiscalYearIdAndStCommitteeTypeIdAndUserIdAndIsDeleted(Long stFiscalYearId, Long stCommitteeTypeId, Long userId, Boolean isDeleted);

    List<AddMemberInCommittee> findByActiveAndIsDeleted(Boolean active, Boolean isDeleted);
}
