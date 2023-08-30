package com.ibcs.idsdp.services;

import com.ibcs.idsdp.model.domain.Component;
import com.ibcs.idsdp.model.domain.Module;
import com.ibcs.idsdp.model.repositories.ModuleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ModuleService {

    ModuleRepository moduleRepository;

    /**
     * For  Finding getAllModuleByComponent
     * @param component
     * @return
     */
    public List<Module> getAllModuleByComponent(Component component){
        return moduleRepository.findAllByComponent(component);
    }

    /**
     * For  Finding Module getById
     * @param moduleId
     * @return
     */
    public Module getById(Long moduleId) {
        return moduleRepository.findById(moduleId).get();
    }

    /**
     * For  Finding getAllModules
     * @return
     */
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    public Module getByName(String name){
        return moduleRepository.findByName(name);
    }
}
