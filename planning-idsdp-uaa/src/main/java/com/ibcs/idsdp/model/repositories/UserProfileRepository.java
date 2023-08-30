package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    UserProfile findByUserId(Long id);
}
