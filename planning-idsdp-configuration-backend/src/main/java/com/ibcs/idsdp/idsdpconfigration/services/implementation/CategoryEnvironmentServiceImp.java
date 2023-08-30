package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.CategoryPerEnvironmentConservationRules;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.CategoryEnvironmentRepository;
import com.ibcs.idsdp.idsdpconfigration.services.CategoryEnvironmentService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.CategoryPerEnvironmentConservationRulesDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class CategoryEnvironmentServiceImp extends BaseService<CategoryPerEnvironmentConservationRules, CategoryPerEnvironmentConservationRulesDTO> implements CategoryEnvironmentService {

    private final CategoryEnvironmentRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;

    public CategoryEnvironmentServiceImp(CategoryEnvironmentRepository repository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    /**
     * for convertForCreate
     */
    @Override
    protected CategoryPerEnvironmentConservationRules convertForCreate(CategoryPerEnvironmentConservationRulesDTO dto) {
        CategoryPerEnvironmentConservationRules category = super.convertForCreate(dto);
        category.setCode(idGeneratorComponent.generateCode(dto.getCategoryCodeName(), repository.count()));
        return category;
    }

    /**
     * for convertForUpdate
     */
    @Override
    protected void convertForUpdate(CategoryPerEnvironmentConservationRulesDTO dto, CategoryPerEnvironmentConservationRules category) {
        dto.setCode(category.getCode());
        super.convertForUpdate(dto, category);
    }

    /**
     * for get Active CategoryEnvironmentList
     *
     * @return
     */
    @Override
    public List<CategoryPerEnvironmentConservationRulesDTO> getAllActiveCategoryEnvironmentList() {
        return this.convertForRead(repository.findAllByStatusAndIsDeleted(true, false));
    }
}


