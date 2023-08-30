package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.Permission;
import com.ibcs.idsdp.model.domain.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {

    boolean existsByPermissionName(String name);

    Optional<Permission> findAllByPermissionName(String name);

    @Query("SELECT p FROM Permission p WHERE p.id not in(SELECT a.permission.id FROM ApiEndpoints a) or p.id in (SELECT a.permission.id FROM ApiEndpoints a WHERE subModule.id =:subModuleId )")
    List<Permission> findByPermissionExistInApiEndpoints(@Param("subModuleId") Long subModuleId);
}
