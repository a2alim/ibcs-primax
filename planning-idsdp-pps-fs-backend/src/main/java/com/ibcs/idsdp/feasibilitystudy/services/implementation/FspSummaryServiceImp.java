package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.feasibilitystudy.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.feasibilitystudy.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.feasibilitystudy.approval_process_flow.model.repositories.ProjectMovementRepository;
import com.ibcs.idsdp.feasibilitystudy.client.ConfigurationClientService;
import com.ibcs.idsdp.feasibilitystudy.client.ProjectConceptClientService;
import com.ibcs.idsdp.feasibilitystudy.client.dto.response.UserGroupResponse;
import com.ibcs.idsdp.feasibilitystudy.model.domain.FspSummary;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.FspSummaryRepository;
import com.ibcs.idsdp.feasibilitystudy.services.FspSummaryService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.FspSummaryDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.ProjectConceptShortInfoDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Slf4j
@Service
public class FspSummaryServiceImp extends BaseService<FspSummary, FspSummaryDTO> implements FspSummaryService {

    private final FspSummaryRepository fspSummaryRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final ProjectMovementRepository projectMovementRepository;
    private final ConfigurationClientService configurationClientService;
    private final ProjectConceptClientService projectConceptClientService;

    public FspSummaryServiceImp(FspSummaryRepository fspSummaryRepository, IdGeneratorComponent idGeneratorComponent,
                                ProjectMovementRepository projectMovementRepository, ConfigurationClientService configurationClientService,
                                ProjectConceptClientService projectConceptClientService) {
        super(fspSummaryRepository);
        this.fspSummaryRepository = fspSummaryRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.projectMovementRepository = projectMovementRepository;
        this.configurationClientService = configurationClientService;
        this.projectConceptClientService = projectConceptClientService;
    }

    /**
     * Covert data for create
     * @param fspSummaryDTO
     * @return
     */
    @Override
    protected FspSummary convertForCreate(FspSummaryDTO fspSummaryDTO) {
        FspSummary fspSummary = fspSummaryRepository.findAllByProjectConceptMasterUuidAndIsDeleted(fspSummaryDTO.getProjectConceptMasterUuid(), false);
        if(fspSummary != null){
            fspSummaryDTO.setUuid(fspSummary.getUuid());
        }
        if (fspSummaryRepository.existsByProjectConceptMasterUuidAndIsDeleted(fspSummaryDTO.getProjectConceptMasterUuid(), false))
            super.updateEntity(fspSummaryDTO);
        FspSummary fspSummary1 = super.convertForCreate(fspSummaryDTO);

        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Long id = Long.parseLong(accessTokenDetail.getId());
        UserGroupResponse userGroup = configurationClientService.getUserGroupByUserId(id);
        fspSummary1.setAgencyId(userGroup.getAgency().getId());

        return fspSummary1;
    }

    @Override
    public FspSummaryDTO create(FspSummaryDTO fspSummaryDTO) {
        FspSummaryDTO dto =  super.create(fspSummaryDTO);

        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Long id = Long.parseLong(accessTokenDetail.getId());
        updateProjectConceptShortInfo(fspSummaryDTO);

        /* * saving primary movement stage * */
        ProjectMovementStage projectMovementStage = new ProjectMovementStage();
        projectMovementStage.setCurrentStage(MovementStageEnum.valueOf("AGENCY_DESK"));
        projectMovementStage.setFsProposalMasterId(dto.getId());
        projectMovementStage.setIsDeleted(false);
        LocalDateTime localDateTime = LocalDateTime.now();
        projectMovementStage.setCreatedOn(localDateTime.toLocalDate());
        projectMovementStage.setMovementTime(localDateTime);
        projectMovementStage.setUuid(idGeneratorComponent.generateUUID());
        projectMovementStage.setUserId(id);
        projectMovementRepository.save(projectMovementStage);
        /* * saving primary movement stage * */

        return dto;
    }

    @Override
    public FspSummaryDTO update(FspSummaryDTO fspSummaryDTO) {
        updateProjectConceptShortInfo(fspSummaryDTO);
        return super.update(fspSummaryDTO);
    }

    //Get all feasibility proposal summary by project concept master uuid
    @Override
    public FspSummaryDTO getFspSummaryByProjectConceptUuid(String projectConceptMasterUuid) {
        FspSummaryDTO fspSummaryDTO = new FspSummaryDTO();

        FspSummary fspSummary = fspSummaryRepository.findAllByProjectConceptMasterUuidAndIsDeleted(projectConceptMasterUuid, false);
        if(fspSummary != null){
            return convertForRead(fspSummary);
        }
        return null;
    }

    private void updateProjectConceptShortInfo(FspSummaryDTO fspSummaryDTO) {
        ProjectConceptShortInfoDTO request = new ProjectConceptShortInfoDTO();
        request.setPcUuid(fspSummaryDTO.getProjectConceptMasterUuid());
        request.setTitleEn(fspSummaryDTO.getTitleEn());
        request.setTitleBn(fspSummaryDTO.getTitleBn());
        request.setCommencementDate(fspSummaryDTO.getDateOfCommencement().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
        request.setCompletionDate(fspSummaryDTO.getDateOfCompletion().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
        projectConceptClientService.updateProjectShortInfo(request);
    }
}
