package com.ibcs.idsdp.projectconcept.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.projectconcept.model.domain.ScopeOfWork;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptMasterRepository;
import com.ibcs.idsdp.projectconcept.model.repositories.ScopeOfWorkRepository;
import com.ibcs.idsdp.projectconcept.services.ScopeOfWorkService;
import com.ibcs.idsdp.projectconcept.web.dto.ScopeOfWorkDto;
import com.ibcs.idsdp.projectconcept.web.dto.ScopeOfWorkDtoDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@Slf4j
public class ScopeOfWorkServiceImp extends BaseService<ScopeOfWork, ScopeOfWorkDto> implements ScopeOfWorkService {
    private ScopeOfWorkRepository scopeOfWorkRepository;
    private ProjectConceptMasterRepository projectConceptMasterRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private AttachmentRepository attachmentRepository;
    protected ScopeOfWorkServiceImp(ScopeOfWorkRepository repository, ProjectConceptMasterRepository projectConceptMasterRepository, IdGeneratorComponent idGeneratorComponent, AttachmentRepository attachmentRepository) {
        super(repository);
        this.scopeOfWorkRepository = repository;
        this.projectConceptMasterRepository = projectConceptMasterRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.attachmentRepository = attachmentRepository;
    }


    /**
     * Create for Scope Of Work
     * @param scopeOfWorkDto
     * @param projectSummaryId
     * @return
     */


    @Override
    public ScopeOfWorkDto createScopeOfWork(ScopeOfWorkDto scopeOfWorkDto, Long projectSummaryId) {
        List<ScopeOfWorkDtoDetails> scopeOfWorkDtoDetails = scopeOfWorkDto.scopeOfWorkDtoDetails;
        for(ScopeOfWorkDtoDetails scope: scopeOfWorkDtoDetails) {
            String uuid = idGeneratorComponent.generateUUID();
            ScopeOfWork scopeOfWork = new ScopeOfWork();
            scopeOfWork.setIsDeleted(false);
            scopeOfWork.setUuid(uuid);
            scopeOfWork.setCreatedOn(LocalDate.now());
            scopeOfWork.setTaskDetails(scope.getTaskDetails());
            scopeOfWork.setStartDate(scope.getStartDate());
            scopeOfWork.setEndDate(scope.getEndDate());
            scopeOfWork.setTaskDetails(scope.getTaskDetails());
            scopeOfWork.setTaskTypeId(scope.getTaskType());
            scopeOfWork.setAttachmentId(scope.getAttachmentId());
            scopeOfWork.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
            scopeOfWorkRepository.save(scopeOfWork);
        }
        return null;
    }


    /**
     * Get Scope Of Work List By Project Id
     * @param id
     * @return List<ScopeOfWorkDtoDetails>
     */

    @Override
    public List<ScopeOfWorkDtoDetails> getScopeOfWorkListByProjectId(Long id) {
        List<ScopeOfWorkDtoDetails> scopeOfWorkDtoDetails = new ArrayList<>();
        List<ScopeOfWork> scopeOfWorkList = scopeOfWorkRepository.findAllByProjectConceptMasterIdAndIsDeleted(id, false);
        for(ScopeOfWork scopeOfWork: scopeOfWorkList) {
            ScopeOfWorkDtoDetails scope = new ScopeOfWorkDtoDetails();
            scope.setTaskDetails(scopeOfWork.getTaskDetails());
            scope.setTaskType(scopeOfWork.getTaskTypeId());
            scope.setStartDate(scopeOfWork.getStartDate());
            scope.setEndDate(scopeOfWork.getEndDate());
            scope.setAttachmentId(scopeOfWork.getAttachmentId());
            Optional<Attachment> attachmentOptional = attachmentRepository.findById(scopeOfWork.getAttachmentId());
            if(attachmentOptional.isPresent()) {
                Attachment attachment = attachmentOptional.get();
                scope.setAttachmentName(attachment.getName());
            }

            scope.setProjectConceptMasterId(scopeOfWork.getProjectConceptMaster().getId());
            scope.setUuid(scopeOfWork.getUuid());
            scopeOfWorkDtoDetails.add(scope);
        }
        return scopeOfWorkDtoDetails;
    }

    /**
     * update Scope Of Work
     * @param scopeOfWorkDto
     * @param projectSummaryId
     * @return ScopeOfWorkDto
     */

    @Override
    public ScopeOfWorkDto updateScopeOfWork(ScopeOfWorkDto scopeOfWorkDto, Long projectSummaryId) {
        List<ScopeOfWorkDtoDetails> scopeOfWorkDtoDetails = scopeOfWorkDto.scopeOfWorkDtoDetails;
        for(ScopeOfWorkDtoDetails scope: scopeOfWorkDtoDetails) {
            if(!scope.getUuid().isEmpty()) {
                Optional<ScopeOfWork> scopeOfWorkOptional = scopeOfWorkRepository.findByUuid(scope.getUuid());
                ScopeOfWork scopeOfWork = scopeOfWorkOptional.get();
                scopeOfWork.setTaskTypeId(scope.getTaskType());
                scopeOfWork.setTaskDetails(scope.getTaskDetails());
                scopeOfWork.setStartDate(scope.getStartDate());
                scopeOfWork.setEndDate(scope.getEndDate());
                scopeOfWork.setAttachmentId(scope.getAttachmentId());
                scopeOfWorkRepository.save(scopeOfWork);
            } else {
                String uuid = idGeneratorComponent.generateUUID();
                ScopeOfWork scopeOfWork = new ScopeOfWork();
                scopeOfWork.setIsDeleted(false);
                scopeOfWork.setUuid(uuid);
                scopeOfWork.setCreatedOn(LocalDate.now());
                scopeOfWork.setTaskDetails(scope.getTaskDetails());
                scopeOfWork.setStartDate(scope.getStartDate());
                scopeOfWork.setEndDate(scope.getEndDate());
                scopeOfWork.setTaskDetails(scope.getTaskDetails());
                scopeOfWork.setTaskTypeId(scope.getTaskType());
                scopeOfWork.setAttachmentId(scope.getAttachmentId());
                scopeOfWork.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                scopeOfWorkRepository.save(scopeOfWork);
            }
        }
        return null;
    }
}
