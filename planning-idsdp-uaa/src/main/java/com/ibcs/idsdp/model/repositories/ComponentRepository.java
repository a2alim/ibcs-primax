package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.Component;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComponentRepository extends JpaRepository<Component, Long> {
}
