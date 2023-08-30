package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Zilla;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface ZillaRepository extends ServiceRepository<Zilla> {

    List<Zilla> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    List<Zilla> findAllByDivisionIdAndStatusAndIsDeleted(Long divisionId, Boolean status, Boolean isDelete);

    List<Zilla> findAllByDivisionIdInAndStatusAndIsDeleted(Set<Long> divisionIds, Boolean status, Boolean isDelete);

    @Query(value = "select z.* from zilla z\n" +
            "join division d on d.id = z.division_id\n" +
            "where d.geo_code = :divisionGeoCode\n" +
            "and z.status = :status\n" +
            "and z.is_deleted = :isDeleted", nativeQuery = true)
    List<Zilla> findAllByDivisionGeoCodeAndStatusAndIsDeleted(String divisionGeoCode, Boolean status, Boolean isDeleted);
}
