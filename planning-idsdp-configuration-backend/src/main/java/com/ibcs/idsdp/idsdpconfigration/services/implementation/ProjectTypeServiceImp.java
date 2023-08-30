package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProjectType;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ProjectTypeRepository;
import com.ibcs.idsdp.idsdpconfigration.services.ProjectTypeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ProjectTypeDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ProjectTypeServiceImp extends BaseService<ProjectType, ProjectTypeDTO> implements ProjectTypeService {

    private final ProjectTypeRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;

    public ProjectTypeServiceImp(ProjectTypeRepository repository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    /**
     * for convertForCreate
     * @param projectTypeDTO
     * @return
     */
    @Override
    protected ProjectType convertForCreate(ProjectTypeDTO projectTypeDTO) {
        ProjectType projectType = super.convertForCreate(projectTypeDTO);
        projectType.setCode(idGeneratorComponent.generateCode(projectTypeDTO.getNameEn(), repository.count()));
        return projectType;
    }

    /**
     * for convertForUpdate
     * @param projectTypeDTO
     * @param projectType
     */
    @Override
    protected void convertForUpdate(ProjectTypeDTO projectTypeDTO, ProjectType projectType) {
        projectTypeDTO.setCode(projectType.getCode());
        super.convertForUpdate(projectTypeDTO, projectType);
    }

    /**
     * for getActiveProjectType
     * @return
     */
    @Override
    public List<ProjectTypeDTO> getActiveProjectType() {
        List<ProjectType> list = repository.findAllByStatusAndIsDeleted(true, false);
        return convertForRead(list);
    }

    @Override
    public ProjectTypeDTO getByNameEn(String nameEn) {
        return convertForRead(repository.findByNameEnAndIsDeleted(nameEn, false));
    }

}


