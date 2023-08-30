package com.ibcs.idsdp.repositories;

import com.ibcs.idsdp.domain.Module;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepo extends JpaRepository<Module, Long> {
}
