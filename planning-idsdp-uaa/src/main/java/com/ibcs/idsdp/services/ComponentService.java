package com.ibcs.idsdp.services;

import com.ibcs.idsdp.model.domain.Component;
import com.ibcs.idsdp.model.repositories.ComponentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ComponentService {

    ComponentRepository componentRepository;

    /**
     * For finding AllComponents
     * @return
     */
    public List<Component> getAllComponents(){
        return componentRepository.findAll();
    }

    /**
     * For finding Component ById
     * @param componentId
     * @return
     */
    public Component getById(Long componentId) {
        return componentRepository.findById(componentId).get();
    }
}
