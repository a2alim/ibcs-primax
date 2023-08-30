package com.ibcs.idsdp.repositories;

import com.ibcs.idsdp.domain.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PermissionRepo extends JpaRepository<Permission, Long> {

    Permission findByPermissionName(String name);
}
