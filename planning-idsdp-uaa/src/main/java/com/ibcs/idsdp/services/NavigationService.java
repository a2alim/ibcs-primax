package com.ibcs.idsdp.services;

import com.ibcs.idsdp.model.domain.Navigation;
import com.ibcs.idsdp.model.repositories.NavigationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class NavigationService {

    NavigationRepository navigationRepository;

    /**
     * For  Finding All Navigation
     * @return
     */
    public List<Navigation> getAllNavigationList(){
        return navigationRepository.findAll();
    }
}
