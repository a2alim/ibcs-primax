package com.ibcs.idsdp.services;

import com.ibcs.idsdp.model.domain.SubModule;
import com.ibcs.idsdp.model.domain.Module;
import com.ibcs.idsdp.model.repositories.SubModuleRepositories;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SubModuleService {

    SubModuleRepositories subModuleRepositories;

    public List<SubModule> getSubModuleByModule(Module module){
        return subModuleRepositories.findAllByModule(module);
    }
    public SubModule getSubModule(Long id){ return subModuleRepositories.findById(id).get(); }
}
