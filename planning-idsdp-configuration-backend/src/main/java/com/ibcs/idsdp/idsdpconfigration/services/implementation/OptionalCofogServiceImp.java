package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.OptionalCofog;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.MainCofogRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.OptionalCofogRepository;
import com.ibcs.idsdp.idsdpconfigration.services.OptionalCofogService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.OptionalCofogDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class OptionalCofogServiceImp extends BaseService<OptionalCofog, OptionalCofogDTO> implements OptionalCofogService {

    private final OptionalCofogRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final MainCofogRepository mainCofogRepository;

    public OptionalCofogServiceImp(OptionalCofogRepository repository, IdGeneratorComponent idGeneratorComponent,
                                   MainCofogRepository mainCofogRepository) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.mainCofogRepository = mainCofogRepository;
    }

    // Override Base Service method for converting from DTO to Entity and arranging data for Create
    @Override
    protected OptionalCofog convertForCreate(OptionalCofogDTO optionalCofogDTO) {
        OptionalCofog optionalCofog = super.convertForCreate(optionalCofogDTO);
        optionalCofog.setCode(idGeneratorComponent.generateCode(optionalCofogDTO.getNameEn(), repository.count()));
        optionalCofog.setMainCofog(mainCofogRepository
                .findByIdAndIsDeleted(optionalCofogDTO.getMainCofogId(), false ).get());
        return optionalCofog;
    }

    // Override Base Service method for converting from DTO to Entity and arranging data for Edit
    @Override
    protected void convertForUpdate(OptionalCofogDTO optionalCofogDTO, OptionalCofog optionalCofog) {
        optionalCofogDTO.setCode(optionalCofog.getCode());
        optionalCofog.setMainCofog(mainCofogRepository
                .findByIdAndIsDeleted(optionalCofogDTO.getMainCofogId(), false ).get());
        super.convertForUpdate(optionalCofogDTO, optionalCofog);
    }

    // For Getting All Active Optional Cofog
    @Override
    public Page<OptionalCofogDTO> getActiveOptionalCofog(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<OptionalCofog> ePage = repository.findAllByStatusAndIsDeleted(true,false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    // For Getting All Active Optional Cofog by Main Cofog Id
    @Override
    public List<OptionalCofogDTO> getByMainCofogId(long mainCofogId) {
        return convertForRead(repository.findByMainCofogIdAndStatusAndIsDeleted(mainCofogId,true,false));
    }
}


