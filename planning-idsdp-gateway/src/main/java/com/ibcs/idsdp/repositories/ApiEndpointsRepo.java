package com.ibcs.idsdp.repositories;

import com.ibcs.idsdp.domain.ApiEndpoints;
import com.ibcs.idsdp.domain.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApiEndpointsRepo extends JpaRepository<ApiEndpoints, Long> {

    List<ApiEndpoints> findByPermissionAndMethodType(Permission permission, String type);

    List<ApiEndpoints> findByPermission(Permission p);
}
