package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.SubModule;
import com.ibcs.idsdp.model.domain.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubModuleRepositories extends JpaRepository<SubModule, Long> {
    List<SubModule> findAllByModule(Module module);
}
