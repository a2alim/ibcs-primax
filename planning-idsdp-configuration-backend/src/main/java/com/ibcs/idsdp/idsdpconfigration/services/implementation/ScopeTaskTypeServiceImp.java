package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ScopeTaskType;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ScopeTaskTypeRepository;
import com.ibcs.idsdp.idsdpconfigration.services.ScopeTaskTypeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ScopeTaskTypeDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ScopeTaskTypeServiceImp extends BaseService<ScopeTaskType, ScopeTaskTypeDTO> implements ScopeTaskTypeService {

    private final ScopeTaskTypeRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;

    public ScopeTaskTypeServiceImp(ScopeTaskTypeRepository repository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    /**
     * for convertForCreate
     * @param scopeTaskTypeDTO
     * @return
     */
    @Override
    protected ScopeTaskType convertForCreate(ScopeTaskTypeDTO scopeTaskTypeDTO) {
        ScopeTaskType scopeTaskType = super.convertForCreate(scopeTaskTypeDTO);
        scopeTaskType.setCode(idGeneratorComponent.generateCode(scopeTaskTypeDTO.getNameEn(), repository.count()));
        return scopeTaskType;
    }

    /**
     * for convertForUpdate
     * @param scopeTaskTypeDTO
     * @param scopeTaskType
     */
    @Override
    protected void convertForUpdate(ScopeTaskTypeDTO scopeTaskTypeDTO, ScopeTaskType scopeTaskType) {
        scopeTaskTypeDTO.setCode(scopeTaskType.getCode());
        super.convertForUpdate(scopeTaskTypeDTO, scopeTaskType);
    }

    /**
     * for get Active ScopeTaskType
     * @param requestBodyDTO
     * @return
     */
    @Override
    public Page<ScopeTaskTypeDTO> getActiveScopeTaskType(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<ScopeTaskType> ePage = repository.findAllByStatusAndIsDeleted(true, false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }
}


