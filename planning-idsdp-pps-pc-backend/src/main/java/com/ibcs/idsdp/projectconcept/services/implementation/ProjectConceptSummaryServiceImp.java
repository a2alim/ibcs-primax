package com.ibcs.idsdp.projectconcept.services.implementation;


import com.ibcs.idsdp.common.config.HelperComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.projectconcept.model.domain.ProjectConceptSummary;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptMasterRepository;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptSummaryRepository;
import com.ibcs.idsdp.projectconcept.services.ProjectConceptSummaryService;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectConceptSummaryDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ProjectConceptSummaryServiceImp extends BaseService<ProjectConceptSummary, ProjectConceptSummaryDTO> implements ProjectConceptSummaryService {

    private final ProjectConceptSummaryRepository repository;
    private final ProjectConceptMasterRepository projectConceptMasterRepository;
    private final HelperComponent helperComponent;

    public ProjectConceptSummaryServiceImp(ProjectConceptSummaryRepository repository, ProjectConceptMasterRepository projectConceptMasterRepository, HelperComponent helperComponent) {
        super(repository);
        this.repository = repository;
        this.projectConceptMasterRepository = projectConceptMasterRepository;
        this.helperComponent = helperComponent;
    }

    /**
     * Converting and arranging data for create
     *
     * @param projectConceptSummaryDTO
     */
    @Override
    protected ProjectConceptSummary convertForCreate(ProjectConceptSummaryDTO projectConceptSummaryDTO) {
        validationCheck(projectConceptSummaryDTO);
        ProjectConceptSummary projectConceptSummary = super.convertForCreate(projectConceptSummaryDTO);
        projectConceptSummary.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectConceptSummaryDTO.getProjectConceptMasterId(), false).get());
        return projectConceptSummary;
    }


    /**
     * Converting and arranging data for update
     *
     * @param projectConceptSummaryDTO
     * @param projectConceptSummary
     */
    @Override
    protected void convertForUpdate(ProjectConceptSummaryDTO projectConceptSummaryDTO, ProjectConceptSummary projectConceptSummary) {
        validationCheck(projectConceptSummaryDTO);
        projectConceptSummary.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectConceptSummaryDTO.getProjectConceptMasterId(), false).get());
        super.convertForUpdate(projectConceptSummaryDTO, projectConceptSummary);
    }

    /**
     * Validation check during create and update
     *
     * @param projectConceptSummaryDTO
     */
    private void validationCheck(ProjectConceptSummaryDTO projectConceptSummaryDTO) {

        if (projectConceptSummaryDTO.getIsEcaRequired()) {
            System.out.println("ECA Description and attachment saved as null");
//            if (!helperComponent.nonNullAndNotEmptyStringCheck(projectConceptSummaryDTO.getDescriptionEca())) {
//                throw new ServiceExceptionHolder.InvalidRequestException("ECA Description can't be null or empty");
//            }
//            if (projectConceptSummaryDTO.getEcaAttachmentId() == null) {
//                throw new ServiceExceptionHolder.InvalidRequestException("ECA Attachment can't be null");
//            }
        } else {
            projectConceptSummaryDTO.setDescriptionEca(null);
            projectConceptSummaryDTO.setEcaAttachmentId(null);
        }

        if (projectConceptSummaryDTO.getIsEiaRequired()) {
            System.out.println("EIA Description and attachment saved as null");
//            if (!helperComponent.nonNullAndNotEmptyStringCheck(projectConceptSummaryDTO.getDescriptionEia())) {
//                throw new ServiceExceptionHolder.InvalidRequestException("EIA Description can't be null or empty");
//            }
//            if (projectConceptSummaryDTO.getEiaAttachmentId() == null) {
//                throw new ServiceExceptionHolder.InvalidRequestException("EIA Attachment can't be null");
//            }
        } else {
            projectConceptSummaryDTO.setDescriptionEia(null);
            projectConceptSummaryDTO.setEiaAttachmentId(null);
        }

        if (projectConceptSummaryDTO.getIsLandRequired()) {
            System.out.println("Land Description and attachment saved as null");
//            if (!helperComponent.nonNullAndNotEmptyStringCheck(projectConceptSummaryDTO.getDescriptionLand())) {
//                throw new ServiceExceptionHolder.InvalidRequestException("Land Description can't be null or empty");
//            }
//            if (projectConceptSummaryDTO.getLandAttachmentId() == null) {
//                throw new ServiceExceptionHolder.InvalidRequestException("Land Attachment can't be null");
//            }
        } else {
            projectConceptSummaryDTO.setDescriptionLand(null);
            projectConceptSummaryDTO.setLandAttachmentId(null);
        }

        if (projectConceptSummaryDTO.getIsFeasibilityRequired()) {
            System.out.println("FS Description and attachment saved as null");
//            if (!helperComponent.nonNullAndNotEmptyStringCheck(projectConceptSummaryDTO.getDescriptionFs())) {
//                throw new ServiceExceptionHolder.InvalidRequestException("FS Description can't be null or empty");
//            }
//            if (projectConceptSummaryDTO.getFsAttachmentId() == null) {
//                throw new ServiceExceptionHolder.InvalidRequestException("FS Attachment can't be null");
//            }
        } else {
            projectConceptSummaryDTO.setDescriptionFs(null);
            projectConceptSummaryDTO.setFsAttachmentId(null);
        }

        if (projectConceptSummaryDTO.getIsPppRequired()) {
            System.out.println("PPP Description and attachment saved as null");
//            if (!helperComponent.nonNullAndNotEmptyStringCheck(projectConceptSummaryDTO.getDescriptionPpp())) {
//                throw new ServiceExceptionHolder.InvalidRequestException("PPP Description can't be null or empty");
//            }
//            if (projectConceptSummaryDTO.getPppAttachmentId() == null) {
//                throw new ServiceExceptionHolder.InvalidRequestException("PPP Attachment can't be null");
//            }
        } else {
            projectConceptSummaryDTO.setDescriptionPpp(null);
            projectConceptSummaryDTO.setPppAttachmentId(null);
        }
    }
}


