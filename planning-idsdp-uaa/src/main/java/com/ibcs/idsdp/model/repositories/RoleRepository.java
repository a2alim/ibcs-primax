package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    boolean existsByRoleName(String role);
    boolean existsByPriority(Integer priority);

    Optional<Role> findByRoleName(String name);

    @Query(value = "select * from role r where r.is_role_delete= false", nativeQuery = true)
    List<Role> findAllByIsNotDelete();

    Page<Role> findAllByIsRoleDelete(Boolean isDelete, Pageable pageable);

    @Query(value = "select * from role r " +
            "where r.is_role_delete= false " +
            "and (lower(r.role_name) like %:value% " +
            "or lower(r.role_description) like %:value% " +
            "or CAST(r.priority AS varchar) like %:value%) ", nativeQuery = true)
    Page<Role> findAllByValue(String value, Pageable pageable);

    @Query(value = "select * from role r " +
            "where r.is_role_delete= false " +
            "and (lower(r.role_name) like %:value% " +
            "or lower(r.role_description) like %:value% " +
            "or CAST(r.priority AS varchar) like %:value%) ", nativeQuery = true)
    List<Role> findAllByValue(String value);
}
