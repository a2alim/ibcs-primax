package com.ibcs.idsdp.service;

import com.ibcs.idsdp.domain.Navigation;
import com.ibcs.idsdp.repositories.NavigationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NavigationService {
    @Autowired
    NavigationRepo navigationRepo;

    public Navigation findByNavId(String navId){
        return navigationRepo.findByNavId(navId);
    }
}
