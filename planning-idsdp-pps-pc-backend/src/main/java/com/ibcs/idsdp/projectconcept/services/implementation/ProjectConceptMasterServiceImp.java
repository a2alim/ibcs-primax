package com.ibcs.idsdp.projectconcept.services.implementation;


import com.ibcs.idsdp.common.config.HelperComponent;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.projectconcept.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.projectconcept.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.projectconcept.approval_process_flow.model.repositories.ProjectMovementRepository;
import com.ibcs.idsdp.projectconcept.client.AmsClientService;
import com.ibcs.idsdp.projectconcept.client.ConfigurationClientService;
import com.ibcs.idsdp.projectconcept.client.DppClientService;
import com.ibcs.idsdp.projectconcept.client.UaaClientService;
import com.ibcs.idsdp.projectconcept.client.dto.*;
import com.ibcs.idsdp.projectconcept.client.dto.response.AnnexureAmountDTO;
import com.ibcs.idsdp.projectconcept.client.dto.response.MinistryDivision;
import com.ibcs.idsdp.projectconcept.client.dto.response.UserGroupResponse;
import com.ibcs.idsdp.projectconcept.enums.SourceEnum;
import com.ibcs.idsdp.projectconcept.model.domain.ProjectConceptMaster;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptMasterRepository;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptSummaryRepository;
import com.ibcs.idsdp.projectconcept.services.ProjectConceptMasterService;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectConceptMasterDTO;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectConceptSummaryDTO;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectTypeDTO;
import com.ibcs.idsdp.projectconcept.web.dto.amsDTO.AmsAccessTokenResponseDTO;
import com.ibcs.idsdp.projectconcept.web.dto.pageable.Pageable;
import com.ibcs.idsdp.projectconcept.web.dto.pageable.PageableResponse;
import com.ibcs.idsdp.projectconcept.web.dto.request.*;
import com.ibcs.idsdp.projectconcept.web.dto.response.AmsResponseDTO;
import com.ibcs.idsdp.projectconcept.web.dto.response.AmsUnapprovedProjectResponseDTO;
import com.ibcs.idsdp.projectconcept.web.dto.response.DppObjectiveCostDTO;
import com.ibcs.idsdp.projectconcept.web.dto.response.ResponseStatusDTO;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ProjectConceptMasterServiceImp extends BaseService<ProjectConceptMaster, ProjectConceptMasterDTO> implements ProjectConceptMasterService {

    private final ProjectConceptMasterRepository repository;
    private final ProjectConceptSummaryRepository projectConceptSummaryRepository;
    private final ProjectConceptSummaryServiceImp projectConceptSummaryServiceImp;
    private final HelperComponent helperComponent;
    private final EntityManagerFactory entityManagerFactory;
    private final AttachmentRepository attachmentRepository;
    private final UaaClientService uaaClientService;
    private IdGeneratorComponent idGeneratorComponent;
    private ProjectMovementRepository projectMovementRepository;
    private final DppClientService dppClientService;
    private final ConfigurationClientService configClientService;
    private final AmsClientService amsClientService;

    public ProjectConceptMasterServiceImp(ProjectConceptMasterRepository repository,
                                          ProjectConceptSummaryRepository projectConceptSummaryRepository,
                                          ProjectConceptSummaryServiceImp projectConceptSummaryServiceImp,
                                          HelperComponent helperComponent, EntityManagerFactory entityManagerFactory,
                                          AttachmentRepository attachmentRepository, UaaClientService uaaClientService,
                                          IdGeneratorComponent idGeneratorComponent, ProjectMovementRepository projectMovementRepository,
                                          DppClientService dppClientService, ConfigurationClientService configClientService,
                                          AmsClientService amsClientService) {
        super(repository);
        this.repository = repository;
        this.projectConceptSummaryRepository = projectConceptSummaryRepository;
        this.projectConceptSummaryServiceImp = projectConceptSummaryServiceImp;
        this.helperComponent = helperComponent;
        this.entityManagerFactory = entityManagerFactory;
        this.attachmentRepository = attachmentRepository;
        this.uaaClientService = uaaClientService;
        this.idGeneratorComponent = idGeneratorComponent;
        this.projectMovementRepository = projectMovementRepository;
        this.dppClientService = dppClientService;
        this.configClientService = configClientService;
        this.amsClientService = amsClientService;
    }


    /**
     * Converting and arranging data for create
     *
     * @param projectConceptMasterDTO
     */
    @Override
    protected ProjectConceptMaster convertForCreate(ProjectConceptMasterDTO projectConceptMasterDTO) {
        validationCheck(projectConceptMasterDTO);

        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Long id = Long.parseLong(accessTokenDetail.getId());
        UserGroupResponse userGroup = configClientService.getUserGroupByUserId(id);

        ProjectConceptMaster projectConceptMaster = super.convertForCreate(projectConceptMasterDTO);
        projectConceptMaster.setParipatraVersionId(projectConceptMasterDTO.getParipatraVersionId());
        if (projectConceptMasterDTO.getIsForeignAid()) {
            projectConceptMaster.setPaAmount(projectConceptMasterDTO.getRpaAmount() + projectConceptMaster.getDpaAmount());
        }

        if (projectConceptMasterDTO.getAgencyId() != null && projectConceptMasterDTO.getAgencyId() > 0) {
            projectConceptMaster.setAgencyId(projectConceptMasterDTO.getAgencyId());
        } else {
            projectConceptMaster.setAgencyId(userGroup.getAgency().getId());
        }

        projectConceptMaster.setTotalAmount(projectConceptMaster.getGobAmount() + projectConceptMaster.getOwnFundAmount() + projectConceptMaster.getPaAmount() + projectConceptMaster.getOtherAmount());
        return projectConceptMaster;
    }


    /**
     * Converting and arranging data for update
     *
     * @param projectConceptMasterDTO
     * @param projectConceptMaster
     */
    @Override
    protected void convertForUpdate(ProjectConceptMasterDTO projectConceptMasterDTO, ProjectConceptMaster projectConceptMaster) {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Long id = Long.parseLong(accessTokenDetail.getId());
        UserGroupResponse userGroup = configClientService.getUserGroupByUserId(id);
        if (projectConceptMasterDTO.getAgencyId() != null && projectConceptMasterDTO.getAgencyId() > 0) {
            projectConceptMasterDTO.setAgencyId(projectConceptMasterDTO.getAgencyId());
        } else {
            projectConceptMasterDTO.setAgencyId(userGroup.getAgency().getId());
        }

        validationCheck(projectConceptMasterDTO);
        projectConceptMasterDTO.setPpsCode(projectConceptMaster.getPpsCode());
        projectConceptMasterDTO.setMovementDate(projectConceptMaster.getMovementDate());
        if (projectConceptMasterDTO.getIsForeignAid()) {
            projectConceptMasterDTO.setPaAmount(projectConceptMasterDTO.getRpaAmount() + projectConceptMaster.getDpaAmount());
        }
        projectConceptMasterDTO.setTotalAmount(projectConceptMasterDTO.getGobAmount() + projectConceptMasterDTO.getOwnFundAmount() + projectConceptMasterDTO.getPaAmount() + projectConceptMasterDTO.getOtherAmount());
        super.convertForUpdate(projectConceptMasterDTO, projectConceptMaster);
    }

    /**
     * Override create
     *
     * @param projectConceptMasterDTO
     * @return
     */
    @Override
    public ProjectConceptMasterDTO create(ProjectConceptMasterDTO projectConceptMasterDTO) {

        List<ProjectConceptMaster> list = repository.findAllByTitleEnAndImplementingAgencyNameAndIsDeleted(projectConceptMasterDTO.getTitleEn(), projectConceptMasterDTO.getImplementingAgencyName(), false);
        if (list.size() > 0 && projectConceptMasterDTO.getPcLinkId() == null && projectConceptMasterDTO.getAmsId() == null) {
            throw new ServiceExceptionHolder.InvalidRequestException("Already exist project with the same title in this agency");
        }

        ProjectConceptMasterDTO dto = super.create(projectConceptMasterDTO);
        projectConceptMasterDTO.getProjectConceptSummary().setProjectConceptMasterId(dto.getId());
        dto.setProjectConceptSummary(projectConceptSummaryServiceImp.create(projectConceptMasterDTO.getProjectConceptSummary()));

        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Long id = Long.parseLong(accessTokenDetail.getId());

        /* * saving primary movement stage * */
        ProjectMovementStage projectMovementStage = new ProjectMovementStage();
        projectMovementStage.setCurrentStage(MovementStageEnum.valueOf("AGENCY_DESK"));
        projectMovementStage.setProjectConceptMasterId(dto.getId());
        projectMovementStage.setIsDeleted(false);
        LocalDateTime localDateTime = LocalDateTime.now();
        projectMovementStage.setCreatedOn(localDateTime.toLocalDate());
        projectMovementStage.setMovementTime(localDateTime);
        projectMovementStage.setUuid(idGeneratorComponent.generateUUID());
        projectMovementStage.setUserId(id);
        projectMovementRepository.save(projectMovementStage);
        /* * saving primary movement stage * */

        //Set & Save PPS Code
        setPpsCode(dto, projectConceptMasterDTO);

        return dto;
    }

    private void setPpsCode(ProjectConceptMasterDTO dto, ProjectConceptMasterDTO request) {
        //YYYY-SectorId-MinistryDivisionId-AgencyId-ProjectTypeId-Id

        AgencyDTO agencyDTO = configClientService.getAgencyByNameEn(dto.getImplementingAgencyName());
        String ministryAgencyCode = (agencyDTO==null)?"":String.valueOf(agencyDTO.getMinistryDivisionDTO().getId()+agencyDTO.getId());
        String ppsCode = dto.getCreatedDate().getYear() + dto.getSectorId().toString() + ministryAgencyCode + dto.getProjectTypeId().toString() + dto.getId().toString();

        ProjectConceptMaster pc = super.getByUuidForRead(dto.getUuid());
        dto.setPpsCode(ppsCode);
        pc.setPpsCode(ppsCode);
        repository.save(pc);

        if (request.getAmsId()!=null && request.getAmsId()>0 && request.getAmsCode()!=null) {
            sendAmsGreenPageFeedback(request.getAmsId(), request.getAmsCode(), ppsCode);
        }
    }

    private void sendAmsGreenPageFeedback(Long amsId, String amsCode, String ppsCode) {
        AmsAccessTokenResponseDTO token = amsClientService.getAmsAccessToken("pps", "pps@2022");
        if (token.getResponse_code()==1){
            amsClientService.sendAmsGreenPageProjectFeedback(token.getData().getAccess_token(), amsId, amsCode, ppsCode);
        }
    }

    /**
     * Override update
     *
     * @param projectConceptMasterDTO
     * @return
     */
    @Override
    public ProjectConceptMasterDTO update(ProjectConceptMasterDTO projectConceptMasterDTO) {
        ProjectConceptMasterDTO dto = super.update(projectConceptMasterDTO);
        projectConceptMasterDTO.getProjectConceptSummary().setProjectConceptMasterId(dto.getId());
        projectConceptMasterDTO.getProjectConceptSummary().setUuid(
                projectConceptSummaryRepository.findByProjectConceptMasterIdAndIsDeleted(projectConceptMasterDTO.getId(), false).getUuid());
        dto.setProjectConceptSummary(projectConceptSummaryServiceImp.update(projectConceptMasterDTO.getProjectConceptSummary()));
        return dto;
    }

    /**
     * Override get by id
     *
     * @param id
     * @return
     */
    @Override
    public ProjectConceptMasterDTO getById(@NonNull Long id) {
        ProjectConceptMasterDTO dto = super.getById(id);
        dto.setProjectTypeDTO(configClientService.getProjectTypeById(dto.getProjectTypeId()));
        ProjectConceptSummaryDTO projectConceptSummaryDTO = new ModelMapper().map(
                projectConceptSummaryRepository.findByProjectConceptMasterIdAndIsDeleted(dto.getId(), false), ProjectConceptSummaryDTO.class);
        setAttachmentName(dto, projectConceptSummaryDTO);
        dto.setProjectConceptSummary(projectConceptSummaryDTO);
        return dto;
    }

    @Override
    public ProjectConceptMasterDTO getByUuid(@NonNull String uuid) {
        ProjectConceptMasterDTO dto = super.getByUuid(uuid);
        dto.setProjectTypeDTO(configClientService.getProjectTypeById(dto.getProjectTypeId()));
        dto.setIsParipatra2016(false);
        if (dto.getParipatraVersionId()>0) {
            dto.setParipatraVersion(configClientService.getParipatraById(dto.getParipatraVersionId()));
            if (dto.getParipatraVersion().getNameEn().equals("Paripatra 2016")) dto.setIsParipatra2016(true);
        }

        ProjectConceptSummaryDTO projectConceptSummaryDTO = new ModelMapper().map(
                projectConceptSummaryRepository.findByProjectConceptMasterIdAndIsDeleted(dto.getId(), false), ProjectConceptSummaryDTO.class);
        setAttachmentName(dto, projectConceptSummaryDTO);
        dto.setProjectConceptSummary(projectConceptSummaryDTO);

        DppObjectiveCostDTO dppInfo = dppClientService.getDppObjectiveCostByPcUuid(uuid);
        if (dppInfo != null) {
            dto.setTitleEn(dppInfo.getProjectTitleEn());
            dto.setTitleBn(dppInfo.getProjectTitleBn());
            dto.setExpCommencementDate(dppInfo.getDateCommencement());
            dto.setExpCompletionDate(dppInfo.getDateCompletion());
        } else {
            DppObjectiveCostDTO tappInfo = dppClientService.getTappObjectiveCostByPcUuid(uuid);
            if (tappInfo != null) {
                dto.setTitleEn(tappInfo.getProjectTitleEn());
                dto.setTitleBn(tappInfo.getProjectTitleBn());
                dto.setExpCommencementDate(tappInfo.getDateCommencement());
                dto.setExpCompletionDate(tappInfo.getDateCompletion());
            }
        }

        return dto;
    }

    private void setAttachmentName(ProjectConceptMasterDTO dto, ProjectConceptSummaryDTO projectConceptSummaryDTO) {
        Set<Long> attachmentIds = new HashSet<>();
        attachmentIds.add(dto.getAgreementAttachmentId());
        attachmentIds.add(projectConceptSummaryDTO.getEcaAttachmentId());
        attachmentIds.add(projectConceptSummaryDTO.getEiaAttachmentId());
        attachmentIds.add(projectConceptSummaryDTO.getLandAttachmentId());
        attachmentIds.add(projectConceptSummaryDTO.getFsAttachmentId());
        attachmentIds.add(projectConceptSummaryDTO.getPppAttachmentId());
        attachmentIds.add(projectConceptSummaryDTO.getRelevanceWithShortProgramAttachmentId());
        attachmentIds.add(projectConceptSummaryDTO.getRelevanceWithProposalAttachmentId());
        attachmentIds.add(projectConceptSummaryDTO.getRelevanceWithOtherDevelopmentAttachmentId());
        attachmentIds.add(projectConceptSummaryDTO.getInstitutionalArrangementAttachmentId());
        attachmentIds.add(projectConceptSummaryDTO.getExpectedBenefitsAttachmentId());
        Set<Long> finalAttachmentIds = attachmentIds.stream().filter(Objects::nonNull).collect(Collectors.toSet());
        Map<Long, Attachment> attachmentOptional = new HashMap<>();
        if (!finalAttachmentIds.isEmpty()) {
            attachmentOptional = attachmentRepository.findAllByIdInAndIsDeleted(finalAttachmentIds, false)
                    .stream().collect(Collectors.toMap(Attachment::getId, a -> a));

            dto.setAgreementAttachmentName((dto.getAgreementAttachmentId() != null) ? attachmentOptional.get(dto.getAgreementAttachmentId()).getName() : "");
            projectConceptSummaryDTO.setEcaAttachmentName((projectConceptSummaryDTO.getEcaAttachmentId() != null) ? attachmentOptional.get(projectConceptSummaryDTO.getEcaAttachmentId()).getName() : "");
            projectConceptSummaryDTO.setEiaAttachmentName((projectConceptSummaryDTO.getEiaAttachmentId() != null) ? attachmentOptional.get(projectConceptSummaryDTO.getEiaAttachmentId()).getName() : "");
            projectConceptSummaryDTO.setLandAttachmentName((projectConceptSummaryDTO.getLandAttachmentId() != null) ? attachmentOptional.get(projectConceptSummaryDTO.getLandAttachmentId()).getName() : "");
            projectConceptSummaryDTO.setFsAttachmentName((projectConceptSummaryDTO.getFsAttachmentId() != null) ? attachmentOptional.get(projectConceptSummaryDTO.getFsAttachmentId()).getName() : "");
            projectConceptSummaryDTO.setPppAttachmentName((projectConceptSummaryDTO.getPppAttachmentId() != null) ? attachmentOptional.get(projectConceptSummaryDTO.getPppAttachmentId()).getName() : "");
            projectConceptSummaryDTO.setRelevanceWithShortProgramAttachmentName((projectConceptSummaryDTO.getRelevanceWithShortProgramAttachmentId() != null) ? attachmentOptional.get(projectConceptSummaryDTO.getRelevanceWithShortProgramAttachmentId()).getName() : "");
            projectConceptSummaryDTO.setRelevanceWithProposalAttachmentName((projectConceptSummaryDTO.getRelevanceWithProposalAttachmentId() != null) ? attachmentOptional.get(projectConceptSummaryDTO.getRelevanceWithProposalAttachmentId()).getName() : "");
            projectConceptSummaryDTO.setRelevanceWithOtherDevelopmentAttachmentName((projectConceptSummaryDTO.getRelevanceWithOtherDevelopmentAttachmentId() != null) ? attachmentOptional.get(projectConceptSummaryDTO.getRelevanceWithOtherDevelopmentAttachmentId()).getName() : "");
            projectConceptSummaryDTO.setInstitutionalArrangementAttachmentName((projectConceptSummaryDTO.getInstitutionalArrangementAttachmentId() != null) ? attachmentOptional.get(projectConceptSummaryDTO.getInstitutionalArrangementAttachmentId()).getName() : "");
            projectConceptSummaryDTO.setExpectedBenefitsAttachmentName((projectConceptSummaryDTO.getExpectedBenefitsAttachmentId() != null) ? attachmentOptional.get(projectConceptSummaryDTO.getExpectedBenefitsAttachmentId()).getName() : "");
        }
    }

    /**
     * Validation check during create and update
     *
     * @param projectConceptMasterDTO
     */
    private void validationCheck(ProjectConceptMasterDTO projectConceptMasterDTO) {
        if (projectConceptMasterDTO.getIsSelfFund()) {
            System.out.println("own fund and fe own fund can be empty");
//            if (!helperComponent.nonNullAndNonZeroDoubleCheck(projectConceptMasterDTO.getOwnFundAmount())) {
//                throw new ServiceExceptionHolder.InvalidRequestException("Own fund can't be 0 or null");
//            }
//
//            if (!helperComponent.nonNullAndNonZeroDoubleCheck(projectConceptMasterDTO.getFeOwnFundAmount())) {
//                throw new ServiceExceptionHolder.InvalidRequestException("FE Own fund can't be 0 or null");
//            }
        } else {
            projectConceptMasterDTO.setOwnFundAmount(0.0);
            projectConceptMasterDTO.setFeOwnFundAmount(0.0);
        }

        if (projectConceptMasterDTO.getIsForeignAid()) {
            System.out.println("agreement,attachment,rpa,dpa can be empty");
//            if (!helperComponent.nonNullAndNotEmptyStringCheck(projectConceptMasterDTO.getAgreementNo())) {
//                throw new ServiceExceptionHolder.InvalidRequestException("Agreement no can't be null or empty");
//            }
//            if (projectConceptMasterDTO.getAgreementAttachmentId() == null) {
//                throw new ServiceExceptionHolder.InvalidRequestException("Agreement attachment can't be null");
//            }
//            if (!helperComponent.nonNullAndNonZeroDoubleCheck(projectConceptMasterDTO.getRpaAmount())) {
//                throw new ServiceExceptionHolder.InvalidRequestException("RPA can't be 0 or null");
//            }
//            if (!helperComponent.nonNullAndNonZeroDoubleCheck(projectConceptMasterDTO.getDpaAmount())) {
//                throw new ServiceExceptionHolder.InvalidRequestException("DPA can't be 0 or null");
//            }
        } else {
            projectConceptMasterDTO.setPaAmount(0.0);
            projectConceptMasterDTO.setDpaAmount(0.0);
            projectConceptMasterDTO.setRpaAmount(0.0);
        }

        if (helperComponent.nonNullAndNonZeroDoubleCheck(projectConceptMasterDTO.getOtherAmount())) {
            System.out.println("fe other can be empty");
//            if (!helperComponent.nonNullAndNonZeroDoubleCheck(projectConceptMasterDTO.getFeOtherAmount())) {
//                throw new ServiceExceptionHolder.InvalidRequestException("Fe Other Amount can't be 0");
//            }
        } else {
            projectConceptMasterDTO.setOtherAmount(0.0);
            projectConceptMasterDTO.setFeOtherAmount(0.0);
        }
    }


    /**
     * for get ProjectSummary By SectorDivision
     *
     * @param request
     * @return Page<ProjectSummaryDTO>
     */
    @Override
    public Page<ProjectConceptMasterDTO> getProjectSummaryBySectorDivision(ProjectSummarySearchRequest request) {
        org.springframework.data.domain.Pageable pageable = this.getPageable(request.getPageableRequestBodyDTO());
        Page<ProjectConceptMaster> ePage = repository.findAllBySectorDivisionIdAndIsDeletedOrderByIdDesc(request.getSectorDivision(), false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    /**
     * for get ProjectSummary By ProjectType
     *
     * @param request
     * @return Page<ProjectSummaryDTO>
     */
    @Override
    public Page<ProjectConceptMasterDTO> getProjectSummaryByProjectType(ProjectSummarySearchRequest request) {
        org.springframework.data.domain.Pageable pageable = this.getPageable(request.getPageableRequestBodyDTO());
        Page<ProjectConceptMaster> ePage = repository.findAllByProjectTypeIdAndIsDeletedOrderByIdDesc(request.getProjectType(), false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    /**
     * for get ProjectSummary By ForeignAid
     *
     * @param request
     * @return Page<ProjectSummaryDTO>
     */
    @Override
    public Page<ProjectConceptMasterDTO> getProjectSummaryByForeignAid(PageableRequestBodyDTO request) {
        org.springframework.data.domain.Pageable pageable = this.getPageable(request);
        Page<ProjectConceptMaster> ePage = repository.findAllByIsForeignAidAndIsDeletedOrderByIdDesc(true, false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    /**
     * for get ProjectSummary By GoB
     *
     * @param request
     * @return Page<ProjectSummaryDTO>
     */
    @Override
    public Page<ProjectConceptMasterDTO> getProjectSummaryByGoB(PageableRequestBodyDTO request) {
        org.springframework.data.domain.Pageable pageable = this.getPageable(request);
        Page<ProjectConceptMaster> ePage = repository.findAllByGobAmountGreaterThanAndIsDeletedOrderByIdDesc(0.0, false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    /**
     * filtering projects summary list for project concept, feasilbilty study and dpp/tapp
     *
     * @param request
     * @return Page<ProjectSummaryDTO>
     */
    @Override
    public Page<ProjectConceptMasterDTO> criteriaBasedSearch(PsFsListSearchRequest request) {

        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Long id = Long.parseLong(accessTokenDetail.getId());
        UserGroupResponse userGroup = configClientService.getUserGroupByUserId(id);

        org.springframework.data.domain.Pageable pageable = this.getPageable(request.getPageableRequestBodyDTO());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<ProjectConceptMasterDTO> finalList = new ArrayList<>();

        int total = 0;

        String planning = "";
        if (userGroup != null) {
            if (userGroup.getAgency() != null) {
                planning = "AND pcm.agency_id = " + userGroup.getAgency().getId() + " ";
            } else if (userGroup.getMinistryDivision() != null) {
                List<AgencyDTO> agency = configClientService.getByMinistryDivisionId(userGroup.getMinistryDivision().getId()).getBody();
                if (!agency.isEmpty()) {
                    Set<Long> ids = agency.stream().map(UuidIdHolderRequestBodyDTO::getId).collect(Collectors.toSet());
                    planning = "AND pcm.agency_id in (" + StringUtils.join(ids, ',') + ") ";
                } else {
                    return new PageImpl<>(finalList, pageable, total);
                }
            } else if (userGroup.getSectorDivision() != null) {
                planning = " AND pcm.sector_division_id = " + userGroup.getSectorDivision().getId();
            }
        } else {
            List<RoleDTO> roles = uaaClientService.getRolesByUserId(id).getBody();
            if (roles.stream().noneMatch(a -> a.getId() == 1 || a.getId() == 2))
                return new PageImpl<>(finalList, pageable, total);

        }


        String projectName = "";
        if (request.getProjectName() != null) {
            projectName = " AND (LOWER(pcm.title_en) like '%" + request.getProjectName().toLowerCase() + "%' OR LOWER(pcm.title_bn) like '%" + request.getProjectName().toLowerCase() + "%') ";
        }

        String projectType = "";
        if (request.getProjectType() != null) {
            projectType = " AND pcm.project_type_id = " + request.getProjectType();
        }

        String sectorDivision = "";
        if (request.getSectorDivision() != null) {
            sectorDivision = " AND pcm.sector_division_id = " + request.getSectorDivision();
        }

        String sector = "";
        if (request.getSector() != null) {
            sector = " AND pcm.sector_id = " + request.getSector();
        }

        String amountRange = "", lowAmount = "", highAmount = "";
        if (request.getSource().equals(SourceEnum.PROJECT_SUMMARY) || request.getSource().equals(SourceEnum.FS_PROPOSAL)) {
            if (request.getLowAmount() != null && request.getHighAmount() != null)
                amountRange = " AND pcm.total_amount >= " + request.getLowAmount() + " AND pcm.total_amount <= " + request.getHighAmount();
            if (request.getLowAmount() != null && request.getHighAmount() == null)
                lowAmount = " AND pcm.total_amount <= " + request.getLowAmount();
            if (request.getLowAmount() == null && request.getHighAmount() != null)
                highAmount = " AND pcm.total_amount >= " + request.getHighAmount();
        }

        String gob = "";
        if (request.getGob()) {
            gob = " AND pcm.gob_amount > 0 ";
        }

        String foreignAid = "";
        if (request.getIsForeignAid()) {
            foreignAid = " AND pcm.is_foreign_aid = true ";
        }

        String fsRequired = "";
        if (request.getIsFsRequired()) {
            fsRequired = " AND pcm.id in (SELECT pcs.project_concept_master_id from project_concept_summary pcs " +
                    "WHERE pcs.is_deleted = false AND pcs.is_feasibility_required = true) ";
        }

        String fiscalYearMovementStage = "";
        if (StringUtils.isNotEmpty(request.getStartDate())) {
            fiscalYearMovementStage = " and to_date(cast(pms.movement_time as varchar), 'YYYY-MM-DD') >= case when cast('" + request.getStartDate() + "' as varchar) is null then to_date(cast(pms.movement_time as varchar), 'YYYY-MM-DD') else to_date(cast('" + request.getStartDate() + "' as varchar ), 'YYYY-MM-DD') end ";
        }
        if (StringUtils.isNotEmpty(request.getEndDate())) {
            fiscalYearMovementStage = fiscalYearMovementStage + " and to_date(cast(pms.movement_time as varchar), 'YYYY-MM-DD') <= case when cast('" + request.getEndDate() + "' as varchar) is null then to_date(cast(pms.movement_time as varchar), 'YYYY-MM-DD') else to_date(cast('" + request.getEndDate() + "' as varchar ), 'YYYY-MM-DD') end ";
        }

        String sourceModuleDppTapp = " AND pcm.source_module_type = 'DPP_TAPP' ";
        String sourceModulePc = " AND (pcm.source_module_type = 'PC' OR pcm.source_module_type = 'UPDATE_PC') ";
        String sourceModuleFs = " AND pcm.source_module_type = 'DPP_TAPP' ";

        String sourceModuleForAgency = "";
        if (request.getSource().equals(SourceEnum.PROJECT_SUMMARY))
            sourceModuleForAgency = sourceModulePc;
        else if (request.getSource().equals(SourceEnum.DPP) || request.getSource().equals(SourceEnum.TAPP))
            sourceModuleForAgency = sourceModuleDppTapp;

        String status = "";
        if (request.getStatus() != null) {
            status = " AND s.status = " + request.getStatus().ordinal() + " ";
        }

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        log.info("Query Starts");
        try {
            String allStage = "select * from selectedData s where 1=1 " + status;
            String searchStageTwoThree = "select * from selectedData s where s.status in (2,3,4,5,7,8,9,10,13,14,15,16,17,18,28)" + status;
            String searchStageFourFive = "select * from selectedData s where s.status in (4,5,7,8,9,20,21,22,26,27,29)" + status;
            String searchStageProjectSummary = "select * from selectedData s where s.status in (2,3,4,5,10,28)" + status;
            String searchStageGreaterThanFive = "select * from selectedData s where s.status > 5 and s.status < 10" + status;
            String searchStageGreaterThanSeven = "select * from selectedData s where (s.status > 7 and s.status < 10) OR (s.status > 23 and s.status < 28)" + status;
//            String searchForDpp = "(select dm.project_concept_master_id from dpp_master dm where dm.id = pms.dpp_master_id and dm.is_deleted = false) ";
//            String searchForTapp = "(select toc.project_concept_master_id from tapp_objective_cost toc where toc.id = pms.tapp_master_id and toc.is_deleted = false) ";
            String searchForFsp = "(select fpm.project_concept_master_id from feasibility_proposal_master fpm where fpm.id = pms.fs_proposal_master_id and fpm.is_deleted = false) ";
            String sql = "";
            if (userGroup != null) {
                if (userGroup.getAgency() != null) {
                    if (request.getSource().equals(SourceEnum.PROJECT_SUMMARY)) {
                        sql = getSqlForProjectSummary(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, allStage, sourceModulePc);
                    } else if (request.getSource().equals(SourceEnum.DPP)) {
                        sql = getSqlForDppTapp(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, allStage, sourceModuleDppTapp, fiscalYearMovementStage);
                    } else if (request.getSource().equals(SourceEnum.FS_PROPOSAL)) {
                        sql = getSqlFs(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, allStage, searchForFsp);
                    }

                    // sql = getSqlForAgency(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired);
                } else if (userGroup.getMinistryDivision() != null) {
                    if (request.getSource().equals(SourceEnum.PROJECT_SUMMARY)) {
                        sql = getSqlForProjectSummary(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, searchStageProjectSummary, sourceModulePc);
                    } else if (request.getSource().equals(SourceEnum.DPP)) {
                        sql = getSqlForDppTapp(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, searchStageTwoThree, sourceModuleDppTapp, fiscalYearMovementStage);
                    } else if (request.getSource().equals(SourceEnum.FS_PROPOSAL)) {
                        sql = getSqlFs(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, searchStageTwoThree, searchForFsp);
                    }
                } else if (userGroup.getSectorDivision() != null) {
                    if (request.getSource().equals(SourceEnum.PROJECT_SUMMARY)) {
                        sql = getSqlForProjectSummary(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, searchStageProjectSummary, sourceModulePc);
                    } else if (request.getSource().equals(SourceEnum.DPP)) {
                        sql = getSqlForDppTapp(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, searchStageFourFive, sourceModuleDppTapp, fiscalYearMovementStage);
                    } else if (request.getSource().equals(SourceEnum.FS_PROPOSAL)) {
                        sql = getSqlFs(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, searchStageFourFive, searchForFsp);
                    }
                } else if (userGroup.getPlanningMinister() != null) {
                    if (request.getSource().equals(SourceEnum.PROJECT_SUMMARY)) {
                        sql = getSqlForProjectSummary(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, searchStageGreaterThanFive, sourceModulePc);
                    } else if (request.getSource().equals(SourceEnum.DPP)) {
                        sql = getSqlForDppTapp(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, searchStageGreaterThanFive, sourceModuleDppTapp, fiscalYearMovementStage);
                    } else if (request.getSource().equals(SourceEnum.FS_PROPOSAL)) {
                        sql = getSqlFs(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, searchStageGreaterThanFive, searchForFsp);
                    }
                } else if (userGroup.getEcnec() != null) {
                    if (request.getSource().equals(SourceEnum.PROJECT_SUMMARY)) {
                        sql = getSqlForProjectSummary(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, searchStageGreaterThanSeven, sourceModulePc);
                    } else if (request.getSource().equals(SourceEnum.DPP)) {
                        sql = getSqlForDppTapp(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, searchStageGreaterThanSeven, sourceModuleDppTapp, fiscalYearMovementStage);
                    } else if (request.getSource().equals(SourceEnum.FS_PROPOSAL)) {
                        sql = getSqlFs(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, searchStageGreaterThanSeven, searchForFsp);
                    }
                }
            } else {
                if (request.getSource().equals(SourceEnum.DPP)) {
                    sql = getSqlForDppTapp(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, allStage, sourceModuleDppTapp, fiscalYearMovementStage);
                } else {
                    sql = getSqlForAgency(pageable, planning, projectName, projectType, sectorDivision, sector, amountRange, lowAmount, highAmount, gob, foreignAid, fsRequired, sourceModuleForAgency);
                }
            }

            Query nativeQuery = entityManager.createNativeQuery(sql);
            List<Object[]> l = nativeQuery.getResultList();
            log.info("Query Finished");
            List<ProjectConceptMasterDTO> list = new ArrayList<>();
            for (Object[] objects : l) {
                if (objects[0] != null) {
                    ProjectConceptMasterDTO dto = new ProjectConceptMasterDTO();
                    dto.setId(Long.parseLong(objects[0].toString()));
                    dto.setUuid(objects[1].toString());
                    dto.setTitleEn(objects[2].toString());
                    dto.setTitleBn(objects[3].toString());
                    dto.setExpCommencementDate(LocalDate.parse(objects[4].toString(), formatter));
                    dto.setExpCompletionDate(LocalDate.parse(objects[5].toString(), formatter));
                    dto.setTotalAmount(Double.parseDouble(objects[6].toString()));
                    dto.setGobAmount(Double.parseDouble(objects[7].toString()));
                    dto.setOwnFundAmount(Double.parseDouble(objects[8].toString()));
                    dto.setPaAmount(Double.parseDouble(objects[9].toString()));
                    dto.setRpaAmount(Double.parseDouble(objects[10].toString()));
                    dto.setFeOwnFundAmount(Double.parseDouble(objects[11].toString()));
                    dto.setFeGobAmount(Double.parseDouble(objects[12].toString()));
                    dto.setOtherAmount(Double.parseDouble(objects[13].toString()));
                    dto.setFeOtherAmount(Double.parseDouble(objects[14].toString()));
                    dto.setProjectTypeId(Long.parseLong(objects[15].toString()));
                    dto.setSectorDivisionId(Long.parseLong(objects[16].toString()));
                    if (objects[17] != null) dto.setAgencyId(Long.parseLong(objects[17].toString()));
                    dto.setCreatedDate(LocalDate.parse(objects[18].toString(), formatter));
                    if (objects[19].toString() != null) dto.setSourceModuleType(objects[19].toString());
                    if (objects[20] != null) dto.setSectorId(Long.parseLong(objects[20].toString()));
                    dto.setIsForeignAid((Boolean) objects[21]);
                    if (objects[22] != null) {
                        dto.setStatus(MovementStageEnum.values()[Integer.parseInt(objects[22].toString())]);
                    }else{
                        dto.setStatus(MovementStageEnum.values()[0]);
                    }
                    dto.setUserGroup(userGroup);
                    total = Integer.parseInt(objects[23].toString());
                    if (request.getStatus() == null)
                        list.add(dto);
                    else if (request.getStatus() != null && dto.getStatus().name().equalsIgnoreCase(String.valueOf(request.getStatus())))
                        list.add(dto);
                }
            }

            if (!list.isEmpty()) {
                Map<Long, ProjectTypeDTO> projectTypeDTOMap = configClientService.getProjectTypeByIdSet(
                        new IdSetRequestBodyDTO() {{
                            setIds(list.stream().map(ProjectConceptMasterDTO::getProjectTypeId).collect(Collectors.toSet()));
                        }}).stream().collect(Collectors.toMap(ProjectTypeDTO::getId, dto -> dto));

                Map<Long, AgencyDTO> agencyDTOMap = configClientService.getAgencyByIdSet(
                        new IdSetRequestBodyDTO() {{
                            setIds(list.stream().map(ProjectConceptMasterDTO::getAgencyId).filter(Objects::nonNull).collect(Collectors.toSet()));
                        }}).stream().collect(Collectors.toMap(AgencyDTO::getId, dto -> dto));


                if (request.getSource().equals(SourceEnum.DPP) || request.getSource().equals(SourceEnum.TAPP)) {
                    Map<Long, AnnexureAmountDTO> annexureAmountDTOMap = dppClientService.getGrandTotalByPcIds(list.stream().map(ProjectConceptMasterDTO::getId).collect(Collectors.toSet()));

                    if (request.getLowAmount() != null && request.getHighAmount() != null)
                        list.removeIf(e -> !annexureAmountDTOMap.containsKey(e.getId()) || (annexureAmountDTOMap.containsKey(e.getId()) && annexureAmountDTOMap.get(e.getId()).getTotalAmount() < request.getLowAmount() || annexureAmountDTOMap.get(e.getId()).getTotalAmount() > request.getHighAmount()));
                    else if (request.getLowAmount() != null)
                        list.removeIf(e -> !annexureAmountDTOMap.containsKey(e.getId()) || (annexureAmountDTOMap.containsKey(e.getId()) && annexureAmountDTOMap.get(e.getId()).getTotalAmount() < request.getLowAmount()));
                    else if (request.getHighAmount() != null)
                        list.removeIf(e -> annexureAmountDTOMap.containsKey(e.getId()) && annexureAmountDTOMap.get(e.getId()).getTotalAmount() > request.getHighAmount());

                    finalList = list.stream().peek(m -> {
                        m.setProjectTypeDTO(projectTypeDTOMap.get(m.getProjectTypeId()));
                        m.setAgencyDTO(Objects.nonNull(m.getAgencyId()) ? agencyDTOMap.get(m.getAgencyId()) : null);
                        m.setAnnexureAmount(annexureAmountDTOMap.getOrDefault(m.getId(), null));
                    }).collect(Collectors.toList());
                } else {
                    finalList = list.stream().peek(m -> {
                        m.setProjectTypeDTO(projectTypeDTOMap.get(m.getProjectTypeId()));
                        m.setAgencyDTO(Objects.nonNull(m.getAgencyId()) ? agencyDTOMap.get(m.getAgencyId()) : null);
                    }).collect(Collectors.toList());
                }
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            if (entityManager.isOpen()) entityManager.close();
        }

        return new PageImpl<>(finalList, pageable, total);
    }

    private String getSqlForDppTapp(org.springframework.data.domain.Pageable pageable, String planning, String projectName, String projectType, String sectorDivision, String sector, String amountRange, String lowAmount, String highAmount, String gob, String foreignAid, String fsRequired, String searchStageTwoThree, String sourceModuleDppTapp, String fiscalYearMovementStage) {
        String searchStageApprovedForFiscalYear = "select * from selectedData s where s.status in (7,9)";
        String searchStage =  StringUtils.isEmpty(fiscalYearMovementStage) ? searchStageTwoThree : searchStageApprovedForFiscalYear;

        return "with cte as ( " +
                "with selectedData as " +
                "(select pcm.id, pcm.uuid, pcm.title_en, pcm.title_bn, pcm.exp_commencement_date, pcm.exp_completion_date, " +
                "pcm.total_amount, pcm.gob_amount, pcm.own_fund_amount, pcm.pa_amount, pcm.rpa_amount, pcm.fe_own_fund_amount, " +
                "pcm.fe_gob_amount, pcm.other_amount, pcm.fe_other_amount, pcm.project_type_id, pcm.sector_division_id, pcm.agency_id," +
                "pcm.created_on, pcm.source_module_type, pcm.sector_id, pcm.is_foreign_aid, " +
                "(select pms.current_stage as status from project_movement_stage pms " +
                "where pms.is_deleted = false " +
                "and (pcm.id = (select dm.project_concept_master_id from dpp_master dm where dm.id = pms.dpp_master_id " +
                fiscalYearMovementStage +
                "and dm.is_deleted = false) " +
                "or pcm.id = (select toc.project_concept_master_id from tapp_objective_cost toc where toc.id = pms.tapp_master_id and toc.is_deleted = false)) " +
                "order by pms.movement_time desc limit 1)" +
                "from project_concept_master pcm " +
                "where pcm.is_deleted = false " +
                planning + projectName + projectType + sectorDivision + sector + gob +
                amountRange + lowAmount + highAmount + foreignAid + fsRequired + sourceModuleDppTapp + " " +
                "ORDER BY pcm.movement_date DESC) " +
                searchStage + ") " +
                "SELECT * " +
                "FROM  (TABLE cte " +
                "LIMIT " + pageable.getPageSize() + " OFFSET " + pageable.getOffset() + ") sub " +
                "RIGHT  JOIN (SELECT count(*) FROM cte) c(total) ON true";

    }

    private String getSqlFs(org.springframework.data.domain.Pageable pageable, String planning, String projectName, String projectType, String sectorDivision, String sector, String amountRange, String lowAmount, String highAmount, String gob, String foreignAid, String fsRequired, String searchStageTwoThree, String searchForDpp) {
        return "with cte as ( " +
                "with selectedData as " +
                "(select pcm.id, pcm.uuid, pcm.title_en, pcm.title_bn, pcm.exp_commencement_date, pcm.exp_completion_date, " +
                "pcm.total_amount, pcm.gob_amount, pcm.own_fund_amount, pcm.pa_amount, pcm.rpa_amount, pcm.fe_own_fund_amount, " +
                "pcm.fe_gob_amount, pcm.other_amount, pcm.fe_other_amount, pcm.project_type_id, pcm.sector_division_id, pcm.agency_id," +
                "pcm.created_on, pcm.source_module_type, pcm.sector_id, pcm.is_foreign_aid, " +
                "(select pms.current_stage as status from project_movement_stage pms " +
                "where pms.is_deleted = false and pcm.id = " +
                searchForDpp +
                "order by pms.movement_time desc limit 1)" +
                "from project_concept_master pcm " +
                "where pcm.is_deleted = false " +
                planning + projectName + projectType + sectorDivision + sector + gob +
                amountRange + lowAmount + highAmount + foreignAid + fsRequired + " " +
                "ORDER BY pcm.movement_date DESC) " +
                searchStageTwoThree + ") " +
                "SELECT * " +
                "FROM  (TABLE cte " +
                "LIMIT " + pageable.getPageSize() + " OFFSET " + pageable.getOffset() + ") sub " +
                "RIGHT  JOIN (SELECT count(*) FROM cte) c(total) ON true";

    }

    private String getSqlForProjectSummary(org.springframework.data.domain.Pageable pageable, String planning, String projectName, String projectType, String sectorDivision, String sector, String amountRange, String lowAmount, String highAmount, String gob, String foreignAid, String fsRequired, String searchStage, String sourceModulePc) {
        return "with cte as ( " +
                "with selectedData as " +
                "(select pcm.id, pcm.uuid, pcm.title_en, pcm.title_bn, pcm.exp_commencement_date, pcm.exp_completion_date, " +
                "pcm.total_amount, pcm.gob_amount, pcm.own_fund_amount, pcm.pa_amount, pcm.rpa_amount, pcm.fe_own_fund_amount, " +
                "pcm.fe_gob_amount, pcm.other_amount, pcm.fe_other_amount, pcm.project_type_id, pcm.sector_division_id, pcm.agency_id," +
                "pcm.created_on, pcm.source_module_type, pcm.sector_id, pcm.is_foreign_aid, " +
                "(select pms.current_stage as status from project_movement_stage pms " +
                "where pms.is_deleted = false and pms.project_concept_master_id = pcm.id " +
                "order by pms.movement_time desc limit 1) " +
                "from project_concept_master pcm " +
                "where pcm.is_deleted = false " +
                planning + projectName + projectType + sectorDivision + sector + gob +
                amountRange + lowAmount + highAmount + foreignAid + fsRequired + sourceModulePc + " " +
                "ORDER BY pcm.movement_date DESC) " +
                searchStage + ") " +
                "SELECT * " +
                "FROM  (TABLE cte " +
                "LIMIT " + pageable.getPageSize() + " OFFSET " + pageable.getOffset() + ") sub " +
                "RIGHT  JOIN (SELECT count(*) FROM cte) c(total) ON true";
    }

    private String getSqlForAgency(org.springframework.data.domain.Pageable pageable, String planning, String projectName, String projectType, String sectorDivision, String sector, String amountRange, String lowAmount, String highAmount, String gob, String foreignAid, String fsRequired, String sourceModuleForAgency) {
        return "WITH cte AS ( " +
                "SELECT pcm.id, pcm.uuid, pcm.title_en, pcm.title_bn, pcm.exp_commencement_date, pcm.exp_completion_date, " +
                "pcm.total_amount, pcm.gob_amount, pcm.own_fund_amount, pcm.pa_amount, pcm.rpa_amount, pcm.fe_own_fund_amount, " +
                "pcm.fe_gob_amount, pcm.other_amount, pcm.fe_other_amount, pcm.project_type_id, pcm.sector_division_id, pcm.agency_id," +
                "pcm.created_on, pcm.source_module_type, pcm.sector_id, pcm.is_foreign_aid, " +
                "(select pms.current_stage as status " +
                "from project_movement_stage pms  " +
                "where pms.is_deleted = false  " +
                "and pms.project_concept_master_id = pcm.id  " +
                "order by pms.movement_time desc LIMIT 1) " +
                "FROM project_concept_master pcm " +
                "WHERE pcm.is_deleted = false " +
                planning + projectName + projectType + sectorDivision + sector + gob +
                amountRange + lowAmount + highAmount + foreignAid + fsRequired + sourceModuleForAgency + " " +
                "ORDER BY pcm.movement_date DESC) " +
                "SELECT * " +
                "FROM  (TABLE cte " +
                "LIMIT " + pageable.getPageSize() + " OFFSET " + pageable.getOffset() + ") sub " +
                "RIGHT  JOIN (SELECT count(*) FROM cte) c(total) ON true";
    }


    @Override
    public Page<ProjectConceptMasterDTO> applyFilter(SearchWithPageableRequest request) {
        try {
            int page = request.getPage();
            int size = request.getSize();
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<ProjectConceptMaster> pageResult = repository.findAllByValue(request.getValue().toLowerCase(), pageRequest);
            List<ProjectConceptMasterDTO> finalList = new ArrayList<>();
            if (!pageResult.getContent().isEmpty()) {
                Map<Long, ProjectTypeDTO> projectTypeDTOMap = configClientService.getProjectTypeByIdSet(
                        new IdSetRequestBodyDTO() {{
                            setIds(pageResult.getContent().stream().map(ProjectConceptMaster::getProjectTypeId).collect(Collectors.toSet()));
                        }}).stream().collect(Collectors.toMap(ProjectTypeDTO::getId, dto -> dto));
                List<ProjectConceptMasterDTO> list = convertForRead(pageResult.getContent());
                finalList = list.stream().peek(m -> m.setProjectTypeDTO(projectTypeDTOMap.get(m.getProjectTypeId()))).collect(Collectors.toList());
            }
            return new PageImpl<>(finalList, pageRequest, pageResult.getTotalElements());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Set<Long> getProjectConceptIdListByAgency(Long agencyId) {
        Set<Long> pcIds = new HashSet<>();
        List<ProjectConceptMaster> projectConceptMasters = repository.findByAgencyId(agencyId);
        if (!projectConceptMasters.isEmpty()) {
            pcIds = projectConceptMasters.stream().map(ProjectConceptMaster::getId).collect(Collectors.toSet());
        }
        return pcIds;
    }

    @Override
    public List<ProjectConceptMasterDTO> getNonApprovedDppTapp() {
        List<ProjectConceptMasterDTO> list = convertForRead(repository.findAllDppTappBeforeApprovedAndIsDeleted(false));
        setProjectTypeDTO(list);
        return list;
    }

    @Override
    public List<ProjectConceptMasterDTO> getApprovedDppTapp() {
        List<ProjectConceptMasterDTO> list = convertForRead(repository.findAllApprovedDppTappAndIsDeleted(false));
        setProjectTypeDTO(list);
        return list;
    }

    @Override
    public List<ProjectConceptMasterDTO> getApprovedDppTappForEpims() {
        List<ProjectConceptMasterDTO> list = convertForRead(repository.findAllApprovedDppTappAndIsDeletedForEpims(false));
        setProjectTypeDTO(list);
        return list;
    }

    @Override
    public List<ProjectConceptMasterDTO> getDppTappForSpims() {
        List<ProjectConceptMasterDTO> list = convertForRead(repository.findAllDppTappAndIsDeletedForSpims(false));
        setProjectTypeDTO(list);
        return list;
    }

    private void setProjectTypeDTO(List<ProjectConceptMasterDTO> list) {
        Map<Long, ProjectTypeDTO> projectTypeDTOMap = configClientService.getProjectTypeByIdSet(
                new IdSetRequestBodyDTO() {{
                    setIds(list.stream().map(ProjectConceptMasterDTO::getProjectTypeId).collect(Collectors.toSet()));
                }}).stream().collect(Collectors.toMap(ProjectTypeDTO::getId, dto -> dto));
        list.stream().peek(m -> m.setProjectTypeDTO(projectTypeDTOMap.get(m.getProjectTypeId()))).collect(Collectors.toList());
    }

    @Override
    public ProjectConceptMasterDTO getProjectConceptByPpsCode(String ppsCode) {
        Optional<ProjectConceptMaster> pc = repository.findByPpsCodeAndIsDeleted(ppsCode, false);
        if (pc.isEmpty()) return null;
        ProjectConceptMasterDTO dto = convertForRead(pc.get());
        dto.setProjectTypeDTO(configClientService.getProjectTypeById(dto.getProjectTypeId()));
        return dto;
    }

    @Override
    public ProjectConceptMasterDTO getProjectConceptByPpsId(Long ppsId) {
        Optional<ProjectConceptMaster> pc = repository.findByIdAndIsDeleted(ppsId, false);
        if (pc.isEmpty()) return null;
        ProjectConceptMasterDTO dto = convertForRead(pc.get());
        dto.setProjectTypeDTO(configClientService.getProjectTypeById(dto.getProjectTypeId()));
        return dto;
    }

    @Override
    public PageableResponse applyMisQuery(MisQueryRequest query) {
        PageableResponse result = new PageableResponse();
        validateQuery(query);

        Long[] divisionLocation = null;
        Long[] zillaLocation = null;
        Long[] upazilaLocation = null;

        if (query.getDivisionLocationId()>0) {
            Set<Long> division = new HashSet<>();
            division.add(query.getDivisionLocationId());
            divisionLocation = division.stream()
                    .map(Long::valueOf)
                    .toArray(Long[]::new);
        }
        if (query.getZillaLocationId()>0) {
            Set<Long> zilla = new HashSet<>();
            zilla.add(query.getZillaLocationId());
            zillaLocation = zilla.stream()
                    .map(Long::valueOf)
                    .toArray(Long[]::new);
        }
        if (query.getUpazilaLocationId()>0) {
            Set<Long> upazila = new HashSet<>();
            upazila.add(query.getUpazilaLocationId());
            upazilaLocation = upazila.stream()
                    .map(Long::valueOf)
                    .toArray(Long[]::new);
        }

        PageableRequestBodyDTO pageableRequestBody = new PageableRequestBodyDTO();
        pageableRequestBody.setPage(query.getPage());
        pageableRequestBody.setSize(query.getSize());
        org.springframework.data.domain.Pageable pageable = this.getPageable(pageableRequestBody);
        Page<ProjectConceptMaster> list = repository.findAllByQuery(query.getSectorDivisionId(), query.getSectorId(), query.getSubSectorId(), query.getProjectTypeId(),
                query.getPaAmountFrom(), query.getPaAmountTo(), query.getGobAmountFrom(), query.getGobAmountTo(), query.getOwnAmountFrom(), query.getOwnAmountTo(),
                query.getTotalAmountFrom(), query.getTotalAmountTo(), query.getIsFundingTypeGob(), query.getIsFundingTypeOwn(), query.getIsFundingTypeOther(),
                query.getIsFinancingTypeGob(), query.getIsFinancingTypePa(), query.getMinistryName(), query.getAgencyName(), query.getFiscalYearFrom(), query.getFiscalYearTo(),
                divisionLocation, zillaLocation, upazilaLocation, pageable);

        Page<ProjectConceptMasterDTO> listDTO = new PageImpl<>(convertForRead(list.getContent()), pageable, list.getTotalElements());
        Map<Long, ProjectTypeDTO> projectTypeDTOMap = configClientService.getProjectTypeByIdSet(
                new IdSetRequestBodyDTO() {{
                    setIds(listDTO.stream().map(ProjectConceptMasterDTO::getProjectTypeId).collect(Collectors.toSet()));
                }}).stream().collect(Collectors.toMap(ProjectTypeDTO::getId, dto -> dto));
        listDTO.stream().peek(m -> m.setProjectTypeDTO(projectTypeDTOMap.get(m.getProjectTypeId()))).collect(Collectors.toList());

        convertPageToListData(listDTO, result);
        return result;
    }

    private void validateQuery(MisQueryRequest request) {
        if (request.getAgencyName()!=null && request.getAgencyName().equals("")) {
            request.setAgencyName(null);
        }
        if (request.getMinistryName() != null && request.getMinistryName().equals("")) {
            request.setMinistryName(null);
        }
        if (request.getFiscalYearFrom()!=null && request.getFiscalYearFrom().equals("")) {
            request.setFiscalYearFrom(null);
        } else if (request.getFiscalYearFrom()!=null && !request.getFiscalYearFrom().isEmpty()) {
            request.setFiscalYearFrom(request.getFiscalYearFrom().concat("-01-01"));
        }
        if (request.getFiscalYearTo()!=null && request.getFiscalYearTo().equals("")) {
            request.setFiscalYearTo(null);
        } else if (request.getFiscalYearTo()!=null && !request.getFiscalYearTo().isEmpty()) {
            request.setFiscalYearTo(request.getFiscalYearTo().concat("-12-31"));
        }
        if (request.getDivisionLocationId()>0) {
            request.setProjectTypeId(configClientService.getProjectTypeByNameEn("DPP").getId().intValue());
        }
    }

    private void convertPageToListData(Page<ProjectConceptMasterDTO> list, PageableResponse result) {
        Pageable pageable = new Pageable();
        pageable.setPageNumber(list.getPageable().getPageNumber());
        pageable.setPageSize(list.getPageable().getPageSize());
        pageable.setOffset(list.getPageable().getOffset());
        pageable.setPaged(list.getPageable().isPaged());
        pageable.setUnpaged(list.getPageable().isUnpaged());

        result.setContent(list.getContent());
        result.setPageable(pageable);
        result.setTotalElements(list.getTotalElements());
        result.setTotalPages(list.getTotalPages());
        result.setLast(list.isLast());
        result.setSize(list.getSize());
        result.setNumber(list.getNumber());
        result.setNumberOfElements(list.getNumberOfElements());
        result.setFirst(list.isFirst());
        result.setEmpty(list.isEmpty());
    }

    @Override
    public ResponseStatusDTO ecnecApprovalProjectAcknowledgement(ProjectListDTO projectDTO) {
        ResponseStatusDTO response = new ResponseStatusDTO("success", "Successfully project acknowledged with ECNEC");
        Optional<ProjectConceptMaster> pc = repository.findByPpsCodeAndIsDeleted(projectDTO.getPpsCode(), false);
        if (pc.isPresent()) {
            ProjectConceptMaster pcInfo = pc.get();
            if (pcInfo.getIsEcnecAcknowledgement() == null || !pcInfo.getIsEcnecAcknowledgement()) {
                pcInfo.setIsEcnecAcknowledgement(true);
                pcInfo.setEcnecId(projectDTO.getEcnecId());
                repository.save(pcInfo);
            } else if (pcInfo.getIsEcnecAcknowledgement()) {
                response.setStatus("fail");
                response.setMessage("Project already acknowledged with ECNEC");
            }
        } else {
            response.setStatus("fail");
            response.setMessage("Project not found");
        }

        return response;
    }

    @Override
    public ProjectConceptMasterDTO updateProjectShortInfo(ProjectConceptShortInfoDTO request) {
        ProjectConceptMasterDTO pcDTO = new ProjectConceptMasterDTO();
        Optional<ProjectConceptMaster> item = repository.findByUuidAndIsDeleted(request.getPcUuid(), false);
        if (item.isPresent()) {
            ProjectConceptMaster pcInfo = item.get();
            pcInfo.setTitleEn(request.getTitleEn());
            pcInfo.setTitleBn(request.getTitleBn());
            pcInfo.setExpCommencementDate(request.getCommencementDate());
            pcInfo.setExpCompletionDate(request.getCompletionDate());
            if (request.getSectorDivisionId() != null && request.getSectorDivisionId() > 0) {
                pcInfo.setSectorDivisionId(request.getSectorDivisionId());
                pcInfo.setSectorId(request.getSectorId());
                pcInfo.setSubSectorId(request.getSubSectorId());
            }
            pcDTO = convertForRead(repository.save(pcInfo));
        }
        return pcDTO;
    }

    @Override
    public ProjectConceptMasterDTO updateMovementTimeByPcId(Long pcId) {
        ProjectConceptMasterDTO pcDTO = new ProjectConceptMasterDTO();
        Optional<ProjectConceptMaster> pcItem = repository.findByIdAndIsDeleted(pcId, false);
        if (pcItem.isPresent()) {
            ProjectConceptMaster pcInfo = pcItem.get();
            pcInfo.setMovementDate(new Date());
            pcDTO = convertForRead(repository.save(pcInfo));
        }
        return pcDTO;
    }

    @Override
    public ProjectConceptMasterDTO updateAmsIdByPpsId(PpsIdAmsIdDTO request) {
        ProjectConceptMasterDTO pcDTO = new ProjectConceptMasterDTO();
        Optional<ProjectConceptMaster> item = repository.findByIdAndIsDeleted(request.getPpsId(), false);
        if (item.isPresent()) {
            ProjectConceptMaster pcInfo = item.get();
            pcInfo.setAmsId(request.getAmsId());
            pcDTO = convertForRead(repository.save(pcInfo));
        }
        return pcDTO;
    }

    @Override
    public List<ProjectConceptMasterDTO> getProjectByAgency() {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Long id = Long.parseLong(accessTokenDetail.getId());
        UserGroupResponse userGroup = configClientService.getUserGroupByUserId(id);

        List<ProjectConceptMaster> list = repository.findAllByAgencyIdAndSourceModuleTypeAndIsDeletedOrderByMovementDateDesc(userGroup.getAgency().getId(),"PC",false);
        return convertForRead(list);
    }

    public AmsUnapprovedProjectResponseDTO amsUnapprovedProjectEntry(AmsUnapprovedProjectRequestDTO request) {
        AmsUnapprovedProjectResponseDTO result = new AmsUnapprovedProjectResponseDTO();
        try {
            return createFromAms(request);
        } catch (Exception exception) {
            result.setStatus("fail");
            result.setMessage(exception.getMessage());
            return result;
        }
    }

    private AmsUnapprovedProjectResponseDTO createFromAms(AmsUnapprovedProjectRequestDTO request) {
        AmsUnapprovedProjectResponseDTO result = new AmsUnapprovedProjectResponseDTO();
        ProjectConceptMasterDTO newRequest = new ProjectConceptMasterDTO();
        ProjectConceptSummaryDTO projectConceptSummary = new ProjectConceptSummaryDTO();
        AgencyDTO agency = configClientService.getAgencyByCode(request.getAgencyCode());
        MinistryDivision ministry = configClientService.getMinistryDivisionByCode(request.getMinistryCode());
        SubSectorDTO subSector = configClientService.getBySubSectorCode(request.getAdpSubSectorCode());
        SectorDTO sector = configClientService.getBySectorId(subSector.getSectorId());
        List<CategoryDTO> categoryList = configClientService.getActiveCategory();
        Optional<CategoryDTO> category = categoryList.stream().filter(m -> m.getCode().equals(request.getEnvironmentCategoryCode())).findFirst();

        if (request.getPpsId() != null && request.getPpsId() > 0) {
            newRequest = getById(request.getPpsId());
        }
        if (request.getProjectType()==1) {
            newRequest.setProjectTypeId(configClientService.getProjectTypeByNameEn("DPP").getId());
        } else if (request.getProjectType()==2) {
            newRequest.setProjectTypeId(configClientService.getProjectTypeByNameEn("TAPP").getId());
        }

        newRequest.setAmsId(request.getAmsId());
        newRequest.setPriorityId(configClientService.getActivePriority().getBody().get(0).getId());
        newRequest.setParipatraVersionId(configClientService.getActiveParipatraList().get(0).getId());
        newRequest.setTitleEn(request.getProjectName());
        newRequest.setTitleBn(request.getProjectNameBn());
        newRequest.setObjectivesEn(request.getProjectObjectives());
        newRequest.setObjectivesBn(request.getProjectObjectivesBn());
        newRequest.setExpCommencementDate(request.getDateOfCommencement());
        newRequest.setExpCompletionDate(request.getDateOfCompletion());
        newRequest.setTotalAmount(request.getEstimatedCost().getTotalAmount());
        newRequest.setGobAmount(request.getEstimatedCost().getGobAmount());
        newRequest.setFeGobAmount(request.getEstimatedCost().getGobFeAmount());
        newRequest.setOwnFundAmount(request.getEstimatedCost().getOwnFundAmount());
        newRequest.setFeOwnFundAmount(request.getEstimatedCost().getOwnFundFeAmount());
        newRequest.setPaAmount(request.getEstimatedCost().getPaAmount());
        newRequest.setRpaAmount(request.getEstimatedCost().getRpaAmount());
        newRequest.setDpaAmount(request.getEstimatedCost().getPaAmount()-request.getEstimatedCost().getRpaAmount());
        newRequest.setOtherAmount(request.getEstimatedCost().getOtherAmount());
        newRequest.setFeOtherAmount(request.getEstimatedCost().getOtherFeAmount());
        newRequest.setSectorDivisionId(sector.getSectorDivisionId());
        newRequest.setSectorId(sector.getId());
        newRequest.setSubSectorId(subSector.getId());
        newRequest.setSponsoringMinistryName(ministry.getNameEn());
        newRequest.setImplementingAgencyName(agency.getNameEn());
        newRequest.setAgencyId(agency.getId());
        newRequest.setSourceModuleType("PC");
        newRequest.setIsForeignAid(request.isForeignAid());
        newRequest.setIsSelfFund(!request.isForeignAid());

        projectConceptSummary.setCatEnvRulesId(category.isPresent()?category.get().getId():categoryList.get(0).getId());
        projectConceptSummary.setIsEcaRequired(request.isEcaRequired());
        projectConceptSummary.setDescriptionEca(request.getDescriptionEca());
        projectConceptSummary.setIsEiaRequired(request.isEiaRequired());
        projectConceptSummary.setDescriptionEia(request.getDescriptionEia());
        projectConceptSummary.setIsLandRequired(false);
        projectConceptSummary.setDescriptionLand("N/A");
        projectConceptSummary.setIsFeasibilityRequired(false);
        projectConceptSummary.setDescriptionFs("N/A");
        projectConceptSummary.setIsPppRequired(false);
        projectConceptSummary.setDescriptionPpp("N/A");
        projectConceptSummary.setRelevanceWithShortProgram("N/A");
        projectConceptSummary.setRelevanceWithProposal("N/A");
        projectConceptSummary.setInstitutionalArrangement("N/A");
        projectConceptSummary.setRelevanceWithOtherDevelopment("N/A");
        projectConceptSummary.setExpectedBenefits("N/A");;

        newRequest.setProjectConceptSummary(projectConceptSummary);
        ProjectConceptMasterDTO pcDTO;
        if (request.getPpsId() != null && request.getPpsId() > 0) {
            pcDTO = update(newRequest);
            result.setMessage("Data updated!");
        } else {
            pcDTO = create(newRequest);
            result.setMessage("Data inserted!");
        }

        result.setStatus("success");
        result.setData(new AmsResponseDTO(pcDTO.getId(), request.getAmsId()));

        return result;
    }

    @Override
    public ProjectConceptMasterDTO updateEpimsCodeByPpsCode(PpsCodeEpimsCodeDTO request) {
        ProjectConceptMasterDTO pcDTO = new ProjectConceptMasterDTO();
        Optional<ProjectConceptMaster> item = repository.findByPpsCodeAndIsDeleted(request.getPpsCode(), false);
        if (item.isPresent()) {
            ProjectConceptMaster pcInfo = item.get();
            pcInfo.setEpimsCode(request.getPimsCode());
            pcDTO = convertForRead(repository.save(pcInfo));
        }
        return pcDTO;
    }

    @Override
    public ProjectConceptMasterDTO savePlisPdfUrl(PlisRequestDTO request) {

        Optional<ProjectConceptMaster> pcInfo = repository.findByIdAndIsDeleted(request.getProject_id(), false);
        if (pcInfo.isPresent()) {
            ProjectConceptMaster pc = pcInfo.get();
            pc.setPlisPdfUrl(request.getPlis_pdf_url());
            pc.setPlisPdfCreatedDate(request.getCreated_date());

            return convertForRead(repository.save(pc));
        }

        return null;
    }
}

