package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.DetailsCofog;
import com.ibcs.idsdp.idsdpconfigration.model.domain.MainCofog;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.MainCofogRepository;
import com.ibcs.idsdp.idsdpconfigration.services.MainCofogService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.MainCofogDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class MainCofogServiceImp extends BaseService<MainCofog, MainCofogDTO> implements MainCofogService {

    private final MainCofogRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;

    public MainCofogServiceImp(MainCofogRepository repository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    // Override Base Service method for converting from DTO to Entity and arranging data for Create
    @Override
    protected MainCofog convertForCreate(MainCofogDTO mainCofogDTO) {
        MainCofog mainCofog = super.convertForCreate(mainCofogDTO);
        mainCofog.setCode(idGeneratorComponent.generateCode(mainCofogDTO.getNameEn(), repository.count()));
        return mainCofog;
    }

    // Override Base Service method for converting from DTO to Entity and arranging data for Edit
    @Override
    protected void convertForUpdate(MainCofogDTO mainCofogDTO, MainCofog mainCofog) {
        mainCofogDTO.setCode(mainCofog.getCode());
        super.convertForUpdate(mainCofogDTO, mainCofog);
    }

    // For Getting All Active Main Cofog
    @Override
    public Page<MainCofogDTO> getActiveMainCofog(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<MainCofog> ePage = repository.findAllByStatusAndIsDeleted(true,false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }
}


