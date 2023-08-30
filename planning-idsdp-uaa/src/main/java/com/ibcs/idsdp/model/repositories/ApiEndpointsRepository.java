package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.ApiEndpoints;
import com.ibcs.idsdp.model.domain.Permission;
import com.ibcs.idsdp.model.domain.Role;
import com.ibcs.idsdp.model.domain.SubModule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ApiEndpointsRepository extends JpaRepository<ApiEndpoints, Long> {
    List<ApiEndpoints> findAllByPermission(Permission permission);
    List<ApiEndpoints> findAllBySubModule(SubModule subModule);
    List<ApiEndpoints> findAllByPermissionAndSubModule(Permission permission, SubModule subModule);

    Page<ApiEndpoints> findAllByIsDelete(Boolean isDelete, Pageable pageable);
    Optional<ApiEndpoints> findByIdAndIsDelete(Long id, Boolean isDelete);

    @Query(value = "select * from api_endpoints a " +
            "where a.is_delete = false " +
            "and (lower(a.name) like %:value% " +
            "or lower(a.api_type) like %:value% " +
            "or lower(a.type) like %:value% " +
            "or a.url in (select u.id from urls u " +
            "where lower(u.url) like %:value%))", nativeQuery = true)
    Page<ApiEndpoints> findAllByValue(String value, Pageable pageable);

}
