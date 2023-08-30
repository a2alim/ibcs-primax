package com.ibcs.idsdp.repositories;

import com.ibcs.idsdp.domain.Component;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComponentRepo extends JpaRepository<Component, Long> {
}
