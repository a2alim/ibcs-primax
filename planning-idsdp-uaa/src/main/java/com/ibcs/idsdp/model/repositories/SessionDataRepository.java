package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.SessionData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.Optional;


public interface SessionDataRepository extends JpaRepository<SessionData,Long> {
    Optional<SessionData> findBySessionId(String sessionId);

    @Transactional
    @Modifying
    void deleteBySessionId(String sessionId);

    void deleteByCreationTimeBefore(LocalDate date);
}
