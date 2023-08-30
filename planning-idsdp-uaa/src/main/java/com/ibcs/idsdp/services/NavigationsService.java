package com.ibcs.idsdp.services;

import com.ibcs.idsdp.exceptions.RoleAlreadyExistException;
import com.ibcs.idsdp.exceptions.RoleNotFoundException;
import com.ibcs.idsdp.model.domain.Navigations;
import com.ibcs.idsdp.model.domain.Role;
import com.ibcs.idsdp.model.repositories.ApiEndpointsRepository;
import com.ibcs.idsdp.model.repositories.NavigationsRepository;
import com.ibcs.idsdp.web.dto.request.RoleRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@AllArgsConstructor
@Service
public class NavigationsService {

    NavigationsRepository navigationsRepository;
    ApiEndpointsRepository apiEndpointsRepository;

    /**
     * For finding get NavigationListByPageable
     * @param page
     * @param size
     * @return
     */
    public Page<Navigations> getNavigationListByPageable(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Navigations> pageResult = navigationsRepository.findAll(pageRequest);
        return new PageImpl<>(pageResult.getContent(), pageRequest, pageResult.getTotalElements());
    }

    /**
     * For finding get All Navigation By SubNav
     * @param title
     * @return
     */
    public List<Navigations> getAllNavigationBySubNav(String title) {
        List<Navigations> navigationsList = null;
        Navigations navigations = findByTitle(title);
        if(navigations!=null)
            navigationsList = navigationsRepository.findAllByParentOrderByOrdersAsc(navigations);
        return navigationsList;
    }

    /**
     * For finding Title
     * @param title
     * @return
     */
    public Navigations findByTitle(String title){
        return navigationsRepository.findByTitle(title);
    }

    public List<Navigations> getByType(String title){
        return navigationsRepository.findAllByType(title);
    }

    /**
     * For saving Navigation
     * @param navigations
     * @return
     */
    public ResponseEntity<String> saveNavigation(Navigations navigations){
//        navigations.setParent(navigationsRepository.findById(navigations.getParent().getId()).get());
//        navigations.setApiEndpoints(apiEndpointsRepository.findById(navigations.getApiEndpoints().getId()).get());
        navigationsRepository.save(navigations);
        return new ResponseEntity("200", HttpStatus.OK);
    }

    public ResponseEntity<String> saveAllNavigation(List<Navigations> navigationsList) {
        navigationsRepository.saveAll(navigationsList);
        return new ResponseEntity("200", HttpStatus.OK);
    }

    /**
     * For editing navigations
     * @param navitionId
     * @param navigations
     * @return
     */
    public ResponseEntity<String> edit(long navitionId, Navigations navigations) {
        Optional<Navigations> optionalRole = navigationsRepository.findById(navitionId);
        if (!optionalRole.isPresent()) {
            throw new RoleNotFoundException("Role Not Found");
        }

        navigations.setId(navitionId);
        return new ResponseEntity("200", HttpStatus.OK);
    }
}