package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.EconomicCode;
import com.ibcs.idsdp.idsdpconfigration.model.domain.SubEconomicCode;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SubEconomicCodeRepository extends ServiceRepository<SubEconomicCode> {
    List<SubEconomicCode> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    @Query(value = "select * from SUB_ECONOMIC_CODE s " +
            "where s.is_deleted = :isDelete " +
            "and s.economic_code_id = :ecCode", nativeQuery = true)
    List<SubEconomicCode> findAllByEconomicCodeIdAndIsDeleted(Long ecCode, Boolean isDelete);

}
