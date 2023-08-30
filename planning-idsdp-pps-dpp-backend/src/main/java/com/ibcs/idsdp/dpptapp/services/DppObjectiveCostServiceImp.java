package com.ibcs.idsdp.dpptapp.services;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.repositories.ProjectMovementRepository;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.model.domain.*;
import com.ibcs.idsdp.dpptapp.model.repositories.DppDevelopmentPartnersRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.services.annexIII_aGoods.AnnexureGoodService;
import com.ibcs.idsdp.dpptapp.web.dto.*;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppProjectManagementSetupDto;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectConceptIdAndComponentNameRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectConceptShortInfoDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.DppAnnualPhasingCostWithChildResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.DppObjectiveCostResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DppObjectiveCostServiceImp extends BaseService<DppObjectiveCost, DppObjectiveCostDTO> implements DppObjectiveCostService {

    private final DppObjectiveCostRepository dppObjectiveCostRepository;
    private final TappObjectiveCostRepository tappObjectiveCostRepository;
    private final DppDevelopmentPartnersRepository dppDevelopmentPartnersRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final ProjectConceptClientService projectConceptClientService;
    private final ProjectMovementRepository projectMovementRepository;
    private final DppAnnualPhasingCostService dppAnnualPhasingCostService;
    private final DppLocationWiseBreakdownService dppLocationWiseBreakdownService;
    private final DppProjectManagementSetupService dppProjectManagementSetupService;
    private final AnnexureGoodService annexureGoodService;
    private final ProjectDetailsPartBService projectDetailsPartBService;
    private final AttachmentUploadService attachmentUploadService;

    public DppObjectiveCostServiceImp(DppObjectiveCostRepository dppObjectiveCostRepository, IdGeneratorComponent idGeneratorComponent,
                                      DppDevelopmentPartnersRepository dppDevelopmentPartnersRepository,
                                      ProjectConceptClientService projectConceptClientService,
                                      ProjectMovementRepository projectMovementRepository, TappObjectiveCostRepository tappObjectiveCostRepository,
                                      DppAnnualPhasingCostService dppAnnualPhasingCostService, DppLocationWiseBreakdownService dppLocationWiseBreakdownService,
                                      DppProjectManagementSetupService dppProjectManagementSetupService, AnnexureGoodService annexureGoodService,
                                      ProjectDetailsPartBService projectDetailsPartBService, AttachmentUploadService attachmentUploadService) {
        super(dppObjectiveCostRepository);
        this.dppObjectiveCostRepository = dppObjectiveCostRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.dppDevelopmentPartnersRepository = dppDevelopmentPartnersRepository;
        this.projectConceptClientService = projectConceptClientService;
        this.projectMovementRepository = projectMovementRepository;
        this.tappObjectiveCostRepository = tappObjectiveCostRepository;
        this.dppAnnualPhasingCostService = dppAnnualPhasingCostService;
        this.dppLocationWiseBreakdownService = dppLocationWiseBreakdownService;
        this.dppProjectManagementSetupService = dppProjectManagementSetupService;
        this.annexureGoodService = annexureGoodService;
        this.projectDetailsPartBService = projectDetailsPartBService;
        this.attachmentUploadService = attachmentUploadService;
    }

    /**
     * Save Method For DppObjectiveCost;
     *
     * @param dppObjectiveCostDTO
     * @return
     */
    @Override
    public DppObjectiveCostDTO createObjectiveCost(DppObjectiveCostDTO dppObjectiveCostDTO) {
        try {
            Long pcMasterId = 0L;
            ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptMasterId(dppObjectiveCostDTO.getProjectConceptUuid());
            if (projectConceptResponse.getId() > 0) {
                pcMasterId = projectConceptResponse.getId();
                String uuid = idGeneratorComponent.generateUUID();
                DppObjectiveCost objectiveCost = new DppObjectiveCost();
                objectiveCost.setCreatedBy("admin");
                objectiveCost.setIsDeleted(false);
                objectiveCost.setCreatedOn(LocalDate.now());
                BeanUtils.copyProperties(dppObjectiveCostDTO, objectiveCost);
                objectiveCost.setProjectConceptMasterId(pcMasterId);
                objectiveCost.setUuid(uuid);
                objectiveCost.setStatus(true);
                // Convert DTO to Objects ;

                // for make list for Currency List from DTO;
                List<DppCurrencyRate> currencyRateList = new ArrayList<>();
                List<DppCurrencyRateDTO> currencyRateDTOList = dppObjectiveCostDTO.getCurrencyRateList();
                for (DppCurrencyRateDTO dto : currencyRateDTOList) {
                    DppCurrencyRate currencyRate = new DppCurrencyRate();
                    // Convert DTO to Objects ;
                    BeanUtils.copyProperties(dto, currencyRate);
                    if (currencyRate.getExchangeRate() != null) {
                        String uui = idGeneratorComponent.generateUUID();
                        currencyRate.setCreatedBy("admin");
                        currencyRate.setIsDeleted(false);
                        currencyRate.setCreatedOn(LocalDate.now());
                        currencyRate.setUuid(uui);
                        currencyRateList.add(currencyRate);
                    }
                }
                // has many Mode currencyRate set in master table: DppObjectiveCost ;
                objectiveCost.setCurrencyRateList(currencyRateList);

                // for make list for Development Partners List from DTO;
                List<DppDevelopmentPartners> developmentPartnersList = new ArrayList<>();
                List<DppDevelopmentPartnersDTO> developmentPartnersDTOList = dppObjectiveCostDTO.getDevelopmentPartnersList();
                for (DppDevelopmentPartnersDTO dto : developmentPartnersDTOList) {
                    DppDevelopmentPartners developmentPartners = new DppDevelopmentPartners();
                    // Convert DTO to Objects ;
                    BeanUtils.copyProperties(dto, developmentPartners);
                    if (developmentPartners.getDevPartnerId() != null) {
                        String uui = idGeneratorComponent.generateUUID();
                        developmentPartners.setGobThruAmount(dto.getGobThruAmount());
                        developmentPartners.setSpAcAmount(dto.getSpAcAmount());
                        developmentPartners.setThruPdAmount(dto.getThruPdAmount());
                        developmentPartners.setThruDpAmount(dto.getThruDpAmount());
                        developmentPartners.setCreatedBy("admin");
                        developmentPartners.setIsDeleted(false);
                        developmentPartners.setCreatedOn(LocalDate.now());
                        developmentPartners.setUuid(uui);
                        developmentPartnersList.add(developmentPartners);
                    }
                }
                // has many Mode currencyRate set in master table: DppObjectiveCost ;
                objectiveCost.setDevelopmentPartnersList(developmentPartnersList);


                // for make list for Mode Financing List from DTO;
                if (dppObjectiveCostDTO.getModeFinanceList().size() > 0) {
                    List<DppModeOfFinancing> modeOfFinancingHashSet = new ArrayList<>();
                    List<DppModeFinancingDTO> modeFinancingDTOList = dppObjectiveCostDTO.getModeFinanceList();
                    for (DppModeFinancingDTO dto : modeFinancingDTOList) {
                        DppModeOfFinancing modeOfFinancing = new DppModeOfFinancing();
                        // Convert DTO to Objects ;
                        BeanUtils.copyProperties(dto, modeOfFinancing);
                        String uuiMode = idGeneratorComponent.generateUUID();
                        modeOfFinancing.setCreatedBy("admin");
                        modeOfFinancing.setIsDeleted(false);
                        modeOfFinancing.setCreatedOn(LocalDate.now());
                        modeOfFinancing.setUuid(uuiMode);
                        modeOfFinancingHashSet.add(modeOfFinancing);
                    }
                    // has many Mode Financing set in master table: DppObjectiveCost ;
                    objectiveCost.setModeFinanceList(modeOfFinancingHashSet);
                }
                objectiveCost.setStatus(true);
                // Save DppObjectiveCost Objects ;
                DppObjectiveCost newDppObjectiveCost = dppObjectiveCostRepository.save(objectiveCost);
                updateProjectConceptShortInfo(dppObjectiveCostDTO);

                /* * saving primary movement stage * */
                AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();

                ProjectMovementStage projectMovementStage = new ProjectMovementStage();
                projectMovementStage.setCurrentStage(MovementStageEnum.valueOf("AGENCY_DESK"));
                projectMovementStage.setDppMasterId(newDppObjectiveCost.getId());
                projectMovementStage.setIsDeleted(false);
                LocalDateTime localDateTime = LocalDateTime.now();
                projectMovementStage.setCreatedOn(localDateTime.toLocalDate());
                projectMovementStage.setMovementTime(localDateTime);
                projectMovementStage.setUuid(idGeneratorComponent.generateUUID());
                projectMovementStage.setUserId(Long.parseLong(accessTokenDetail.getId()));
                projectMovementRepository.save(projectMovementStage);
                /* * saving primary movement stage * */

                dppObjectiveCostDTO.setUuid(objectiveCost.getUuid());
                dppObjectiveCostDTO.setId(objectiveCost.getId());
                return dppObjectiveCostDTO;
            } else {
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private void updateProjectConceptShortInfo(DppObjectiveCostDTO dppObjectiveCostDTO) {
        ProjectConceptShortInfoDTO request = new ProjectConceptShortInfoDTO();
        request.setPcUuid(dppObjectiveCostDTO.getProjectConceptUuid());
        request.setTitleEn(dppObjectiveCostDTO.getProjectTitleEn());
        request.setTitleBn(dppObjectiveCostDTO.getProjectTitleBn());
        request.setCommencementDate(dppObjectiveCostDTO.getDateCommencement());
        request.setCompletionDate(dppObjectiveCostDTO.getDateCompletion());
        request.setSectorDivisionId(dppObjectiveCostDTO.getConcernedDivisionId());
        request.setSectorId(dppObjectiveCostDTO.getSectorId());
        request.setSubSectorId(dppObjectiveCostDTO.getSubSectorId());
        projectConceptClientService.updateProjectShortInfo(request);
    }

    /**
     * Save Method For DppObjectiveCost;
     *
     * @param dppObjectiveCostDTO
     * @return
     */
    @Override
    public DppObjectiveCostDTO updateObjectiveCost(DppObjectiveCostDTO dppObjectiveCostDTO) {
        try {
            Long pcMasterId = 0L;
            ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptMasterId(dppObjectiveCostDTO.getProjectConceptUuid());
            if (projectConceptResponse.getId() > 0) {
                pcMasterId = projectConceptResponse.getId();
                DppObjectiveCost objectiveCost = dppObjectiveCostRepository.findByUuidAndIsDeleted(dppObjectiveCostDTO.getUuid(), false).get();
                Long id = objectiveCost.getId();
                objectiveCost.setUpdatedBy("admin");
                objectiveCost.setIsDeleted(false);
                objectiveCost.setUpdatedOn(LocalDate.now());
                dppObjectiveCostDTO.setFsUuid(objectiveCost.getFsUuid());
                dppObjectiveCostDTO.setFsAttachmentId(objectiveCost.getFsAttachmentId());
                BeanUtils.copyProperties(dppObjectiveCostDTO, objectiveCost);
                objectiveCost.setProjectConceptMasterId(pcMasterId);
                objectiveCost.setId(id);
                objectiveCost.setStatus(true);
                // Convert DTO to Objects ;

                objectiveCost.getCurrencyRateList().clear();
                objectiveCost.getModeFinanceList().clear();
                objectiveCost.getDevelopmentPartnersList().clear();

                // for make list for Currency List from DTO;
                List<DppCurrencyRate> currencyRateList = new ArrayList<>();
                List<DppCurrencyRateDTO> currencyRateDTOList = dppObjectiveCostDTO.getCurrencyRateList();
                for (DppCurrencyRateDTO dto : currencyRateDTOList) {
                    DppCurrencyRate currencyRate = new DppCurrencyRate();
                    // Convert DTO to Objects ;
                    BeanUtils.copyProperties(dto, currencyRate);
                    if (currencyRate.getExchangeRate() != null) {
                        String uui = idGeneratorComponent.generateUUID();
                        currencyRate.setCreatedBy("admin");
                        currencyRate.setIsDeleted(false);
                        currencyRate.setCreatedOn(LocalDate.now());
                        currencyRate.setUuid(uui);
                        currencyRateList.add(currencyRate);
                    }
                }
                // has many Mode currencyRate set in master table: DppObjectiveCost ;
                objectiveCost.setCurrencyRateList(currencyRateList);

                // for make list for Development Partners List from DTO;
                List<DppDevelopmentPartners> developmentPartnersList = new ArrayList<>();
                List<DppDevelopmentPartnersDTO> developmentPartnersDTOList = dppObjectiveCostDTO.getDevelopmentPartnersList();
                for (DppDevelopmentPartnersDTO dto : developmentPartnersDTOList) {
                    DppDevelopmentPartners developmentPartners = new DppDevelopmentPartners();
                    // Convert DTO to Objects ;
                    BeanUtils.copyProperties(dto, developmentPartners);
                    if (developmentPartners.getDevPartnerId() != null) {
                        String uui = idGeneratorComponent.generateUUID();
                        developmentPartners.setGobThruAmount(dto.getGobThruAmount());
                        developmentPartners.setSpAcAmount(dto.getSpAcAmount());
                        developmentPartners.setThruPdAmount(dto.getThruPdAmount());
                        developmentPartners.setThruDpAmount(dto.getThruDpAmount());
                        developmentPartners.setCreatedBy("admin");
                        developmentPartners.setIsDeleted(false);
                        developmentPartners.setCreatedOn(LocalDate.now());
                        developmentPartners.setUuid(uui);
                        developmentPartnersList.add(developmentPartners);
                    }
                }
                // has many Mode currencyRate set in master table: DppObjectiveCost ;
                objectiveCost.setDevelopmentPartnersList(developmentPartnersList);


                // for make list for Mode Financing List from DTO;
                if (dppObjectiveCostDTO.getModeFinanceList().size() > 0) {
                    List<DppModeOfFinancing> modeOfFinancingHashSet = new ArrayList<>();
                    List<DppModeFinancingDTO> modeFinancingDTOList = dppObjectiveCostDTO.getModeFinanceList();
                    for (DppModeFinancingDTO dto : modeFinancingDTOList) {
                        DppModeOfFinancing modeOfFinancing = new DppModeOfFinancing();
                        // Convert DTO to Objects ;
                        BeanUtils.copyProperties(dto, modeOfFinancing);
                        String uuiMode = idGeneratorComponent.generateUUID();
                        modeOfFinancing.setCreatedBy("admin");
                        modeOfFinancing.setIsDeleted(false);
                        modeOfFinancing.setCreatedOn(LocalDate.now());
                        modeOfFinancing.setUuid(uuiMode);
                        modeOfFinancingHashSet.add(modeOfFinancing);
                    }
                    // has many Mode Financing set in master table: DppObjectiveCost ;
                    objectiveCost.setModeFinanceList(modeOfFinancingHashSet);
                }
                objectiveCost.setStatus(true);
                // Save DppObjectiveCost Objects ;
                dppObjectiveCostRepository.save(objectiveCost);
                updateProjectConceptShortInfo(dppObjectiveCostDTO);

                //------------Delete Development partners where dpp_master_id is null--------
                dppDevelopmentPartnersRepository.deleteDppDevPartners();
                dppDevelopmentPartnersRepository.deleteDppModeOfFinance();
                dppDevelopmentPartnersRepository.deleteDppCurrencyRates();

                dppObjectiveCostDTO.setUuid(objectiveCost.getUuid());
                dppObjectiveCostDTO.setId(objectiveCost.getId());
                return dppObjectiveCostDTO;
            } else {
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Get Objective Cost By Pc uuid
     *
     * @param pcuuid
     * @return
     */
    @Transactional
    @Override
    public DppObjectiveCost getObjectiveCostByPcuuid(String pcuuid) {
        try {
            DppObjectiveCost objectiveCostObj = dppObjectiveCostRepository.findByProjectConceptUuidAndIsDeleted(pcuuid.trim(), false).get();
            return objectiveCostObj;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Get Objective Cost By Pc uuid
     *
     * @param pcUuid
     * @return
     */
    @Transactional
    @Override
    public ResponseWithResults getObjectivesAndCost(String pcUuid) {
        Optional<DppObjectiveCost> optional = dppObjectiveCostRepository.findByProjectConceptUuidAndIsDeleted(pcUuid, false);
        if (optional.isPresent()) {
            DppObjectiveCost objectiveCost = optional.get();

            DppObjectiveCostResponse response = new DppObjectiveCostResponse();

            BeanUtils.copyProperties(objectiveCost, response);

            List<DppModeFinancingDTO> financeList = new ArrayList<>();
            List<DppCurrencyRateDTO> currencyList = new ArrayList<>();
            List<DppDevelopmentPartnersDTO> partnerList = new ArrayList<>();

            List<DppModeOfFinancing> modeOfFinancings = objectiveCost.getModeFinanceList();
            for (DppModeOfFinancing mod : modeOfFinancings) {
                DppModeFinancingDTO modeFinancingDTO = new DppModeFinancingDTO();
                BeanUtils.copyProperties(mod, modeFinancingDTO);
                financeList.add(modeFinancingDTO);
            }
            response.setModeFinanceList(financeList);

            List<DppDevelopmentPartners> developmentPartners = objectiveCost.getDevelopmentPartnersList().stream()
                    .filter(e -> e.getIsDeleted() == false).collect(Collectors.toList());
            for (DppDevelopmentPartners mod : developmentPartners) {
                DppDevelopmentPartnersDTO devDto = new DppDevelopmentPartnersDTO();
                BeanUtils.copyProperties(mod, devDto);
                devDto.setGobThruAmount(mod.getGobThruAmount());
                devDto.setSpAcAmount(mod.getSpAcAmount());
                devDto.setThruPdAmount(mod.getThruPdAmount());
                devDto.setThruDpAmount(mod.getThruDpAmount());
                partnerList.add(devDto);
            }
            response.setDevelopmentPartnersList(partnerList);

            List<DppCurrencyRate> curencyRate = objectiveCost.getCurrencyRateList();
            for (DppCurrencyRate mod : curencyRate) {
                DppCurrencyRateDTO devDto = new DppCurrencyRateDTO();
                BeanUtils.copyProperties(mod, devDto);
                currencyList.add(devDto);
            }
            response.setCurrencyRateList(currencyList);

            return new ResponseWithResults(1, "Success", response);
        } else {
            return new ResponseWithResults(0, "Failed", "");
        }

    }

    public ResponseEntity<ResponseStatus> deleteDevPartnerRow(String rowUuid) {
        Optional<DppDevelopmentPartners> devPartner = dppDevelopmentPartnersRepository.findByUuid(rowUuid);
        if (devPartner.isPresent()) {
            DppDevelopmentPartners developmentPartners = devPartner.get();
            developmentPartners.setUpdatedBy("admin");
            developmentPartners.setUpdatedOn(LocalDate.now());
            developmentPartners.setIsDeleted(true);
            dppDevelopmentPartnersRepository.save(developmentPartners);
            return new ResponseEntity(new ResponseStatus(1, "Data deleted successfully"), HttpStatus.OK);
        } else {
            return new ResponseEntity(new ResponseStatus(0, "Data deletion failed"), HttpStatus.OK);
        }
    }

    @Override
    public List<DppObjectiveCostDTO> getObjectiveCostList() {
        return dppObjectiveCostRepository.findAll().stream().map(dppObjectiveCost -> new DppObjectiveCostDTO() {{
            setProjectConceptMasterId(dppObjectiveCost.getProjectConceptMasterId());
            setProjectConceptUuid(dppObjectiveCost.getProjectConceptUuid());
            setProjectTitleEn(dppObjectiveCost.getProjectTitleEn());
            setProjectTitleBn(dppObjectiveCost.getProjectTitleBn());
            setDateCommencement(dppObjectiveCost.getDateCommencement());
            setDateCompletion(dppObjectiveCost.getDateCompletion());
        }}).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public DppObjectiveCostDTO getObjectiveCostByPcUuid(String pcUuid) {
        List<DppModeFinancingDTO> financeList = new ArrayList<>();
        List<DppDevelopmentPartnersDTO> developmentPartnersList = new ArrayList<>();
        Optional<DppObjectiveCost> dppObjectiveCost = dppObjectiveCostRepository.findByProjectConceptUuidAndIsDeleted(pcUuid, false);
        return dppObjectiveCost.isPresent() ?
                dppObjectiveCost.map(objectiveCost -> new DppObjectiveCostDTO() {{
                    setId(objectiveCost.getId());
                    setProjectConceptMasterId(objectiveCost.getProjectConceptMasterId());
                    setProjectConceptUuid(objectiveCost.getProjectConceptUuid());
                    setProjectTitleEn(objectiveCost.getProjectTitleEn());
                    setProjectTitleBn(objectiveCost.getProjectTitleBn());
                    setDateCommencement(objectiveCost.getDateCommencement());
                    setDateCompletion(objectiveCost.getDateCompletion());
                    setConcernedDivisionId(objectiveCost.getConcernedDivisionId());
                    setObjectivesTargets(objectiveCost.getObjectivesTargets());
                    setDppMasterId(objectiveCost.getId());
                    setFsUuid(objectiveCost.getFsUuid());
                    setFsAttachmentId(objectiveCost.getFsAttachmentId());
                    setUuid(objectiveCost.getUuid());
                    setImplementingAgency(objectiveCost.getImplementingAgency());
                    setMinistryDivision(objectiveCost.getMinistryDivision());

                    if (objectiveCost.getFsAttachmentId() != null && objectiveCost.getFsAttachmentId()>0) {
                        setFsAttachmentName(attachmentUploadService.getById(objectiveCost.getFsAttachmentId()).getName());
                    }
                    List<DppModeOfFinancing> modeOfFinancings = dppObjectiveCost.get().getModeFinanceList();
                    for (DppModeOfFinancing mod : modeOfFinancings) {
                        DppModeFinancingDTO modeFinancingDTO = new DppModeFinancingDTO();
                        BeanUtils.copyProperties(mod, modeFinancingDTO);
                        financeList.add(modeFinancingDTO);
                    }
                    setModeFinanceList(financeList);

                    List<DppDevelopmentPartners> developmentPartners = objectiveCost.getDevelopmentPartnersList().stream()
                            .filter(e -> e.getIsDeleted() == false).collect(Collectors.toList());
                    for (DppDevelopmentPartners mod : developmentPartners) {
                        DppDevelopmentPartnersDTO devDto = new DppDevelopmentPartnersDTO();
                        BeanUtils.copyProperties(mod, devDto);
                        developmentPartnersList.add(devDto);
                    }
                    setDevelopmentPartnersList(developmentPartnersList);

                }}).orElse(null) : null;
    }

    @Override
    public AgencyDashboardDTO getAllStagesByPcIds(Set<Long> ids) {

        List<Long> pecProjectIds = new ArrayList<>();
        List<Long> pscProjectIds = new ArrayList<>();
        List<Long> atPCProjectIds = new ArrayList<>();
        List<Long> preparedIds = new ArrayList<>();
        List<Long> notPreparedIds = new ArrayList<>();

        List<MovementStageEnum> movementStageEnums = new ArrayList<>();
        List<DppObjectiveCost> dppObjectiveCosts = dppObjectiveCostRepository.findByProjectConceptMasterIdIn(ids);
        List<DppObjectiveCost> dppObjectiveCostList = new ArrayList<>();
        dppObjectiveCosts.forEach(e -> {
            if (!dppObjectiveCostList.stream().anyMatch(a -> e.getId().equals(a.getId())))
                dppObjectiveCostList.add(e);
        });

//        dppObjectiveCostList.removeIf(e->dppObjectiveCostList.contains(e.getId()));

        int pec = 0, psc = 0, atPC = 0;
        int prepared = 0;

        if (!dppObjectiveCostList.isEmpty()) {
            for (DppObjectiveCost project : dppObjectiveCostList) {
                List<ProjectMovementStage> s = projectMovementRepository.findByDppMasterId(project.getId());
                if (s.size() > 0) {
                    for (ProjectMovementStage stage : s) {
                        if (stage.getCurrentStage() == MovementStageEnum.PEC_MEETING_HELD) {
                            pecProjectIds.add(project.getProjectConceptMasterId());
                        } else if (stage.getCurrentStage() == MovementStageEnum.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD) {
                            pscProjectIds.add(project.getProjectConceptMasterId());
                        } else if (stage.getCurrentStage() == MovementStageEnum.PLANNING_COMMISSION_HEAD) {
                            atPCProjectIds.add(project.getProjectConceptMasterId());
                        }
                    }
                }
            }

//            Set<Long> dppMasterIds = dppObjectiveCostList.stream().map(DppObjectiveCost::getId).collect(Collectors.toSet());
//
//            pec = projectMovementRepository.findDistinctByCurrentStageAndDppMasterIdIn(MovementStageEnum.PEC_MEETING_HELD.ordinal(), dppMasterIds);
//            psc = projectMovementRepository.findDistinctByCurrentStageAndDppMasterIdIn(MovementStageEnum.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD.ordinal(), dppMasterIds);
//            atPC = projectMovementRepository.findDistinctByCurrentStageAndDppMasterIdIn(MovementStageEnum.PLANNING_COMMISSION_HEAD.ordinal(), dppMasterIds);


            for (DppObjectiveCost dppObjectiveCost : dppObjectiveCostList) {

                List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByDppMasterIdOrderByMovementTimeDesc(dppObjectiveCost.getId());
                if (!projectMovementStageList.isEmpty()) {
                    MovementStageEnum anEnum = projectMovementStageList.get(0).getCurrentStage();
                    if (anEnum != null)
                        movementStageEnums.add(anEnum);
                }

                if (projectMovementRepository.existsByDppMasterIdAndCurrentStageNotIn(dppObjectiveCost.getId(), Arrays.asList(MovementStageEnum.AGENCY_DESK, MovementStageEnum.AGENCY_HEAD))) {
//                    prepared++;
                    preparedIds.add(dppObjectiveCost.getId());
                } else {
                    notPreparedIds.add(dppObjectiveCost.getId());
                }

//                if (isDppPreparedOrNot(dppObjectiveCost))
//                    prepared++;
            }

//            notPreparedIds = ids.stream()
//                    .filter(id -> !preparedIds.contains(id))
//                    .collect(Collectors.toList());

        }

        List<TappObjectiveCost> tappObjectiveCosts = tappObjectiveCostRepository.findByProjectConceptMasterIdIn(ids);
        List<TappObjectiveCost> tappObjectiveCostList = new ArrayList<>();
        tappObjectiveCosts.forEach(e -> {
            if (!dppObjectiveCostList.stream().anyMatch(a -> a.getId().equals(a.getId())))
                tappObjectiveCostList.add(e);
        });

        if (!tappObjectiveCostList.isEmpty()) {

            for (TappObjectiveCost project : tappObjectiveCostList) {
                List<ProjectMovementStage> s = projectMovementRepository.findByDppMasterId(project.getId());
                if (s.size() > 0) {
                    for (ProjectMovementStage stage : s) {
                        if (stage.getCurrentStage() == MovementStageEnum.PEC_MEETING_HELD) {
                            pecProjectIds.add(project.getProjectConceptMasterId());
                        } else if (stage.getCurrentStage() == MovementStageEnum.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD) {
                            pscProjectIds.add(project.getProjectConceptMasterId());
                        } else if (stage.getCurrentStage() == MovementStageEnum.PLANNING_COMMISSION_HEAD) {
                            atPCProjectIds.add(project.getProjectConceptMasterId());
                        }
                    }
                }
            }

//            Set<Long> tappMasterIds = tappObjectiveCostList.stream().map(TappObjectiveCost::getId).collect(Collectors.toSet());
//
//            pec += projectMovementRepository.findDistinctByCurrentStageAndTappMasterIdIn(MovementStageEnum.PEC_MEETING_HELD.ordinal(), tappMasterIds);
//            psc += projectMovementRepository.findDistinctByCurrentStageAndTappMasterIdIn(MovementStageEnum.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD.ordinal(), tappMasterIds);
//            atPC += projectMovementRepository.findDistinctByCurrentStageAndTappMasterIdIn(MovementStageEnum.PLANNING_COMMISSION_HEAD.ordinal(), tappMasterIds);

            for (TappObjectiveCost tappObjectiveCost : tappObjectiveCostList) {
                List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByTappMasterIdOrderByMovementTimeDesc(tappObjectiveCost.getId());
                if (!projectMovementStageList.isEmpty()) {
                    MovementStageEnum anEnum = projectMovementStageList.get(0).getCurrentStage();
                    if (anEnum != null)
                        movementStageEnums.add(anEnum);
                }

                if (projectMovementRepository.existsByTappMasterIdAndCurrentStageNotIn(tappObjectiveCost.getId(), Arrays.asList(MovementStageEnum.AGENCY_DESK, MovementStageEnum.AGENCY_HEAD))) {
//                    prepared++;
                    preparedIds.add(tappObjectiveCost.getId());
                } else {
                    notPreparedIds.add(tappObjectiveCost.getId());
                }

//                if (isTappPreparedOrNot(tappObjectiveCost))
//                    prepared++;
            }
        }

        pec = pecProjectIds.size();
        psc = pscProjectIds.size();
        atPC = atPCProjectIds.size();
        prepared = preparedIds.size();

        AgencyDashboardDTO agencyDashboardDTO = new AgencyDashboardDTO();
        agencyDashboardDTO.setApprovedProjects(movementStageEnums.stream().filter(e -> e.equals(MovementStageEnum.APPROVED_BY_PLANNING_MINISTER)).count());
        agencyDashboardDTO.setSendToMinistryDivision(movementStageEnums.stream().filter(e -> e.equals(MovementStageEnum.PLANNING_MINISTER)).count());
        agencyDashboardDTO.setSendToPlanningCommission(movementStageEnums.stream().filter(e -> e.equals(MovementStageEnum.PLANNING_COMMISSION_HEAD)).count());
        agencyDashboardDTO.setRunningProject(movementStageEnums.stream().filter(e -> e.equals(MovementStageEnum.AGENCY_DESK)).count());
        agencyDashboardDTO.setEcnecProjects(movementStageEnums.stream().filter(e -> e.equals(MovementStageEnum.ECNEC) || e.equals(MovementStageEnum.APPROVED_BY_ECNEC)).count());

        agencyDashboardDTO.setPecMeetingHeld((long) pec);
        agencyDashboardDTO.setPscMeetingHeld((long) psc);
        agencyDashboardDTO.setDppAtPC((long) atPC);
        agencyDashboardDTO.setDppPrepared((long) prepared);
        agencyDashboardDTO.setDppNotPrepared((long) notPreparedIds.size());

        agencyDashboardDTO.setPecProjectIds(pecProjectIds);
        agencyDashboardDTO.setPscProjectIds(pscProjectIds);
        agencyDashboardDTO.setAtPCProjectIds(atPCProjectIds);
        agencyDashboardDTO.setPreparedIds(preparedIds);
        agencyDashboardDTO.setNotPreparedIds(notPreparedIds);
        return agencyDashboardDTO;
    }

    private boolean isDppPreparedOrNot(DppObjectiveCost objectiveCost) throws IOException {
        if (objectiveCost == null) {
            return false;
        } else {
            if (objectiveCost.getConcernedDivisionId() == null)
                return false;
            if (objectiveCost.getObjectivesTargets() == null || objectiveCost.getObjectivesTargets().equals(""))
                return false;
            DppAnnualPhasingCostWithChildResponse response = dppAnnualPhasingCostService.getByProjectConceptIdAndComponentName(new ProjectConceptIdAndComponentNameRequest() {{
                setProjectConceptId(objectiveCost.getProjectConceptMasterId());
                setComponentName(DppAnnualPhasing.Revenue_Component.name());
            }}).getBody();
            if (response == null)
                return false;
            List<DppLocationWiseBreakdownDTO> dppLocationWiseBreakdownList = dppLocationWiseBreakdownService.getByProjectConceptMasterId(objectiveCost.getProjectConceptMasterId()).getBody();
            if (dppLocationWiseBreakdownList.isEmpty())
                return false;
            DppProjectManagementSetupDto dppProjectManagementSetupDto = (DppProjectManagementSetupDto) dppProjectManagementSetupService.getProjectSetupListByProject(objectiveCost.getProjectConceptUuid()).getRes();
            if (dppProjectManagementSetupDto.getDppProjectManagementSetupMasterId() == null)
                return false;
            ResponseWithResults goods = annexureGoodService.getDataByFormType("Goods", objectiveCost.getProjectConceptUuid());
            if (goods.getStatus() == 0)
                return false;
            ProjectDetailsPartB projectDetailsPartB = projectDetailsPartBService.getProjectDetailsByProjectId(objectiveCost.getProjectConceptUuid());
            if (projectDetailsPartB == null)
                return false;
        }
        return true;
    }

    private boolean isTappPreparedOrNot(TappObjectiveCost objectiveCost) throws IOException {
        if (objectiveCost == null) {
            return false;
        } else {
            if (objectiveCost.getConcernedDivisionId() == null)
                return false;
            if (objectiveCost.getObjectivesTargets() == null || objectiveCost.getObjectivesTargets().equals(""))
                return false;
            DppAnnualPhasingCostWithChildResponse response = dppAnnualPhasingCostService.getByProjectConceptIdAndComponentName(new ProjectConceptIdAndComponentNameRequest() {{
                setProjectConceptId(objectiveCost.getProjectConceptMasterId());
                setComponentName(DppAnnualPhasing.Revenue_Component.name());
            }}).getBody();
            if (response == null)
                return false;
            List<DppLocationWiseBreakdownDTO> dppLocationWiseBreakdownList = dppLocationWiseBreakdownService.getByProjectConceptMasterId(objectiveCost.getProjectConceptMasterId()).getBody();
            if (dppLocationWiseBreakdownList.isEmpty())
                return false;
            DppProjectManagementSetupDto dppProjectManagementSetupDto = (DppProjectManagementSetupDto) dppProjectManagementSetupService.getProjectSetupListByProject(objectiveCost.getProjectConceptUuid()).getRes();
            if (dppProjectManagementSetupDto.getDppProjectManagementSetupMasterId() == null)
                return false;
            ResponseWithResults goods = annexureGoodService.getDataByFormType("Goods", objectiveCost.getProjectConceptUuid());
            if (goods.getStatus() == 0)
                return false;
            ProjectDetailsPartB projectDetailsPartB = projectDetailsPartBService.getProjectDetailsByProjectId(objectiveCost.getProjectConceptUuid());
            if (projectDetailsPartB == null)
                return false;
        }
        return true;
    }

    @Override
    public ResponseStatus linkFsReportWithDpp(FsLinkWithDto fsLinkWithDto) {
        Optional<DppObjectiveCost> dppObjectiveCostOptional = dppObjectiveCostRepository.findByIdAndIsDeleted(fsLinkWithDto.getDppMasterId(), false);
        if (dppObjectiveCostOptional.isPresent()) {
            DppObjectiveCost dppObjectiveCost = dppObjectiveCostOptional.get();
            if (fsLinkWithDto.getFsUuid() != null && !fsLinkWithDto.getFsUuid().isEmpty()) {
                dppObjectiveCost.setFsUuid(fsLinkWithDto.getFsUuid());
            }
            if (fsLinkWithDto.getFsAttachmentId() != null) {
                dppObjectiveCost.setFsAttachmentId(fsLinkWithDto.getFsAttachmentId());
            }

            dppObjectiveCostRepository.save(dppObjectiveCost);
            return new ResponseStatus(200, "Successfully link with Dpp");
        } else {
            return new ResponseStatus(500, "Can't link with Dpp");
        }
    }

    @Override
    public DppObjectiveCostDTO getDppObjectiveCostByPpsCode(String ppsCode) {
        Optional<DppObjectiveCost> dppInfo = dppObjectiveCostRepository.findByPpsCodeAndIsDeleted(ppsCode, false);
        if (dppInfo.isPresent()) {
            DppObjectiveCostDTO dppInfoDTO = convertForRead(dppInfo.get());
            dppInfoDTO.setDppMasterId(dppInfo.get().getId());
            return dppInfoDTO;
        }
        return null;
    }

    @Override
    public DppObjectiveCostDTO getShortInfoByPcUuid(String pcUuid) {
        DppObjectiveCost dpp = dppObjectiveCostRepository.findByProjectConceptUuid(pcUuid);
        return dpp==null?null:convertForRead(dpp);
    }
}


