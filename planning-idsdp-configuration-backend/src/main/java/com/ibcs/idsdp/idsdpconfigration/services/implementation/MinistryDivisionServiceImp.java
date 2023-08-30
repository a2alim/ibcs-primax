package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.MinistryDivision;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.MinistryDivisionRepository;
import com.ibcs.idsdp.idsdpconfigration.services.MinistryDivisionService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.MinistryDivisionDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class MinistryDivisionServiceImp extends BaseService<MinistryDivision, MinistryDivisionDTO> implements MinistryDivisionService {

    private final MinistryDivisionRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;

    public MinistryDivisionServiceImp(MinistryDivisionRepository repository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    // Override Base Service method for converting from DTO to Entity and arranging data for Create
    @Override
    protected MinistryDivision convertForCreate(MinistryDivisionDTO ministryDivisionDTO) {
        MinistryDivision ministryDivision = super.convertForCreate(ministryDivisionDTO);
        ministryDivision.setCode(idGeneratorComponent.generateCode(ministryDivisionDTO.getNameEn(), repository.count()));
        return ministryDivision;
    }

    // Override Base Service method for converting from DTO to Entity and arranging data for Edit
    @Override
    protected void convertForUpdate(MinistryDivisionDTO ministryDivisionDTO, MinistryDivision ministryDivision) {
        ministryDivisionDTO.setCode(ministryDivision.getCode());
        super.convertForUpdate(ministryDivisionDTO, ministryDivision);
    }

    // For Getting All Active Ministry Division
    @Override
    public Page<MinistryDivisionDTO> getActiveMinistryDivision(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<MinistryDivision> ePage = repository.findAllByStatusAndIsDeleted(true,false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    @Override
    public MinistryDivisionDTO getByNameEn(String nameEn) {
        MinistryDivision ministryDivision = repository.findByNameEnAndIsDeleted(nameEn, false);
        return ministryDivision==null?null:convertForRead(ministryDivision);
    }

    @Override
    public MinistryDivisionDTO getByCode(String code) {
        MinistryDivision ministryDivision = repository.findByCodeAndIsDeleted(code, false);
        return ministryDivision==null?null:convertForRead(ministryDivision);
    }
}


