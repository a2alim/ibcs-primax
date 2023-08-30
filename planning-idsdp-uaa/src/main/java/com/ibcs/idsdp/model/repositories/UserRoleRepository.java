package com.ibcs.idsdp.model.repositories;


import com.ibcs.idsdp.model.domain.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {
    List<UserRole> findAllByUserId(Long userId);

    List<UserRole> findAllByUserIdIn(Set<Long> userIds);

    void deleteByUserId(Long userId);

}
