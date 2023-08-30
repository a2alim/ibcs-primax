package com.ibcs.idsdp.idsdpconfigration.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProjectMovement;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ProjectMovementRepository;
import com.ibcs.idsdp.idsdpconfigration.services.ProjectMovementService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ProjectMovementDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ProjectMoveRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ProjectMovementImp extends BaseService<ProjectMovement, ProjectMovementDTO> implements ProjectMovementService {

    private final ProjectMovementRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;

    public ProjectMovementImp(ProjectMovementRepository repository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    /**
     * for convertForCreate
     * @param projectMovementDTO
     * @return
     */
    @Override
    protected ProjectMovement convertForCreate(ProjectMovementDTO projectMovementDTO) {
        ProjectMovement projectMovement = super.convertForCreate(projectMovementDTO);
        projectMovement.setCode(idGeneratorComponent.generateCode(projectMovementDTO.getMovementTitleEn(), repository.count()));
        projectMovement.setOrderId(repository.count() + 1);
        return projectMovement;
    }

    /**
     * for convertForUpdate
     * @param projectMovementDTO
     * @param projectMovement
     */
    @Override
    protected void convertForUpdate(ProjectMovementDTO projectMovementDTO, ProjectMovement projectMovement) {
        projectMovementDTO.setCode(projectMovement.getCode());
        super.convertForUpdate(projectMovementDTO, projectMovement);
    }

    /**
     * for get Active ProjectMovement
     * @param requestBodyDTO
     * @return
     */
    @Override
    public Page<ProjectMovementDTO> getActiveProjectMovement(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<ProjectMovement> ePage = repository.findAllByStatusAndIsDeleted(true, false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    /**
     * for get ProjectMovement By OrderId
     * @param requestBodyDTO
     * @return
     */
    @Override
    public Page<ProjectMovementDTO> getProjectMovementByOrderId(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<ProjectMovement> ePage = repository.findAllByStatusAndIsDeletedOrderByOrderIdAsc(true, false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    /**
     * for get ProjectMovement By OrderId And Module
     * @param moduleId
     * @return
     */
    @Override
    public List<ProjectMovementDTO> getProjectMovementByOrderIdAndModule(Long moduleId) {
        return super.convertForRead(repository.findAllByStatusAndIsDeletedAndModuleIdOrderByOrderIdAsc(true, false, moduleId));
    }

    /**
     * for move Project
     * @param projectMoveRequest
     */
    @Override
    public void moveProject(ProjectMoveRequest projectMoveRequest) {
        long count = 1L;
        for (Long id : projectMoveRequest.getProjectIds()) {
            Optional<ProjectMovement> projectMovementOptional = repository.findByIdAndIsDeleted(id, false);
            if (projectMovementOptional.isPresent()) {
                ProjectMovement projectMovement = projectMovementOptional.get();
                projectMovement.setOrderId(count++);
                repository.save(projectMovement);
            }
        }

    }

}
