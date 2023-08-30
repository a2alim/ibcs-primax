package com.ibcs.idsdp.dpptapp.services;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.dpptapp.model.domain.GisLocation;
import com.ibcs.idsdp.dpptapp.model.repositories.GisLocationRepository;
import com.ibcs.idsdp.dpptapp.web.dto.GisLocationDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class GisLocationServiceImp extends BaseService<GisLocation, GisLocationDTO> {

    private final GisLocationRepository repository;

    public GisLocationServiceImp(GisLocationRepository repository) {
        super(repository);
        this.repository = repository;
    }

    public List<GisLocationDTO> createList(List<GisLocationDTO> requestList) {
        List<GisLocation> list = new ArrayList<>();
        for (GisLocationDTO gisLocation : requestList) {
            list.add(createEntity(gisLocation));
        }
        return convertForRead(list);
    }

    public List<GisLocationDTO> updateList(Long sourceModuleId, String sourceModuleType, List<GisLocationDTO> requestList) {
        deleteBySourceModuleIdAndSourceModuleType(sourceModuleId, sourceModuleType);
        return createList(requestList);
    }

    private void deleteBySourceModuleIdAndSourceModuleType(Long sourceModuleId, String sourceModuleType) {
        repository.deleteAllBySourceModuleIdAndSourceModuleType(sourceModuleId, sourceModuleType);
    }
}

