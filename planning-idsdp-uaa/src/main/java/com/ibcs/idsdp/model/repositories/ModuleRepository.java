package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.Component;
import com.ibcs.idsdp.model.domain.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    List<Module> findAllByComponent(Component component);
    Module findByName(String name);

}
