package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.DetailsCofog;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.DetailsCofogRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.OptionalCofogRepository;
import com.ibcs.idsdp.idsdpconfigration.services.DetailsCofogService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.DetailsCofogDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.OptionalCofogDTO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class DetailsCofogServiceImp extends BaseService<DetailsCofog, DetailsCofogDTO> implements DetailsCofogService {

    private final DetailsCofogRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final OptionalCofogRepository optionalCofogRepository;

    public DetailsCofogServiceImp(DetailsCofogRepository repository, IdGeneratorComponent idGeneratorComponent,
                                  OptionalCofogRepository optionalCofogRepository) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.optionalCofogRepository = optionalCofogRepository;
    }

    // Convert and Arrange Data from Entity to DTO for Read
    @Override
    protected DetailsCofogDTO convertForRead(DetailsCofog detailsCofog) {
        DetailsCofogDTO detailsCofogDTO = super.convertForRead(detailsCofog);
        detailsCofogDTO.setOptionalCofog(new ModelMapper().map(detailsCofog.getOptionalCofog(), OptionalCofogDTO.class));
        return detailsCofogDTO;
    }

    // Override Base Service method for converting from DTO to Entity and arranging data for Create
    @Override
    protected DetailsCofog convertForCreate(DetailsCofogDTO optionalCofogDTO) {
        DetailsCofog optionalCofog = super.convertForCreate(optionalCofogDTO);
        optionalCofog.setCode(idGeneratorComponent.generateCode(optionalCofogDTO.getNameEn(), repository.count()));
        optionalCofog.setOptionalCofog(optionalCofogRepository
                .findByIdAndIsDeleted(optionalCofogDTO.getOptionalCofogId(), false).get());
        return optionalCofog;
    }

    // Override Base Service method for converting from DTO to Entity and arranging data for Edit
    @Override
    protected void convertForUpdate(DetailsCofogDTO detailCofogDTO, DetailsCofog detailCofog) {
        detailCofogDTO.setCode(detailCofog.getCode());
        detailCofog.setOptionalCofog(optionalCofogRepository
                .findByIdAndIsDeleted(detailCofogDTO.getOptionalCofogId(), false).get());
        super.convertForUpdate(detailCofogDTO, detailCofog);
    }

    // For Getting All Active Details Cofog
    @Override
    public Page<DetailsCofogDTO> getActiveDetailsCofog(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<DetailsCofog> ePage = repository.findAllByStatusAndIsDeleted(true,false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    // For Getting All Details Cofog by Optional Cofog Id
    @Override
    public List<DetailsCofogDTO> getByOptionalCofog(long optionalCofogId) {
        return convertForRead(repository.findAllByOptionalCofogIdAndStatusAndIsDeleted(optionalCofogId, true, false));
    }
}


