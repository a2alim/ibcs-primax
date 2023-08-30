package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.UpaZilla;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface UpaZillaRepository extends ServiceRepository<UpaZilla> {

    List<UpaZilla> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    List<UpaZilla> findAllByZillaIdAndStatusAndIsDeleted(Long zillaId, Boolean status, Boolean isDelete);

    List<UpaZilla> findAllByZillaIdInAndStatusAndIsDeleted(Set<Long> zillaIds, Boolean status, Boolean isDelete);

    @Query(value = "select uz.* from upa_zilla uz \n" +
            "join zilla z on z.id = uz.zilla_id\n" +
            "join division d on d.id = z.division_id\n" +
            "and z.geo_code = :zillaGeoCode\n" +
            "and uz.status = :status\n" +
            "and uz.is_deleted = :isDeleted", nativeQuery = true)
    List<UpaZilla> findAllByZillaGeoCodeAndStatusAndIsDeleted(String zillaGeoCode, Boolean status, Boolean isDeleted);
}
