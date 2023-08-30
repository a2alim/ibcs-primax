package com.ibcs.idsdp.rdpprtapp.services;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.repositories.ProjectMovementRepository;
import com.ibcs.idsdp.rdpprtapp.client.ConfigurationClientService;
import com.ibcs.idsdp.rdpprtapp.client.PpsDppTappClientService;
import com.ibcs.idsdp.rdpprtapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.rdpprtapp.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.rdpprtapp.client.dto.request.ZillaRequest;
import com.ibcs.idsdp.rdpprtapp.client.dto.response.MinistryDivisionDTO;
import com.ibcs.idsdp.rdpprtapp.model.domain.*;
import com.ibcs.idsdp.rdpprtapp.model.repositories.*;
import com.ibcs.idsdp.rdpprtapp.services.implementation.DppAnnualPhasingCostServiceImpl;
import com.ibcs.idsdp.rdpprtapp.services.implementation.TappAnnualPhasingCostServiceImpl;
import com.ibcs.idsdp.rdpprtapp.web.dto.*;
import com.ibcs.idsdp.rdpprtapp.web.dto.ecnecDTO.DistrictGeoDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.ecnecDTO.DivisionGeoDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.ecnecDTO.EcnecProjectInfoDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.ecnecDTO.UpazilaGeoDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.ProjectListDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.SearchRequestDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.*;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.math.RoundingMode;
import java.sql.*;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class DppObjectiveCostServiceImp extends BaseService<DppObjectiveCost, DppObjectiveCostDTO> implements DppObjectiveCostService {
    private final DppObjectiveCostRepository dppObjectiveCostRepository;
    private final TappObjectiveCostRepository tappObjectiveCostRepository;
    private final DppDevelopmentPartnersRepository dppDevelopmentPartnersRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final ProjectConceptClientService projectConceptClientService;
    private final ProjectMovementRepository projectMovementRepository;
    private final DppAnnualPhasingCostServiceImpl annualPhasingCostService;
    private final TappAnnualPhasingCostServiceImpl tappAnnualPhasingCostService;
    private final RdppRTappRevisedVersionRepository rdppRTappRevisedVersionRepository;
    private final ConfigurationClientService configurationClientService;
    private final DppAnnualPhasingCostService dppAnnualPhasingCostService;
    private final PpsDppTappClientService ppsDppTappClientService;
    private final TappObjectiveCostServiceImp tappObjectiveCostService;
    private final ProjectDetailsPartBService projectDetailsPartBService;
    private final DppLocationService dppLocationService;
    private final LogFrameRepository logFrameRepository;
    private final TappLogFrameRepository tappLogFrameRepository;

    @Autowired
    private Environment env;

    public DppObjectiveCostServiceImp(DppObjectiveCostRepository dppObjectiveCostRepository, IdGeneratorComponent idGeneratorComponent,
                                      DppDevelopmentPartnersRepository dppDevelopmentPartnersRepository, LogFrameRepository logFrameRepository,
                                      ProjectConceptClientService projectConceptClientService, ProjectMovementRepository projectMovementRepository,
                                      TappObjectiveCostRepository tappObjectiveCostRepository, RdppRTappRevisedVersionRepository rdppRTappRevisedVersionRepository,
                                      ConfigurationClientService configurationClientService, DppAnnualPhasingCostServiceImpl annualPhasingCostService,
                                      TappAnnualPhasingCostServiceImpl tappAnnualPhasingCostService, DppAnnualPhasingCostService dppAnnualPhasingCostService,
                                      PpsDppTappClientService ppsDppTappClientService, TappObjectiveCostServiceImp tappObjectiveCostService,
                                      ProjectDetailsPartBService projectDetailsPartBService, DppLocationService dppLocationService, TappLogFrameRepository tappLogFrameRepository) {
        super(dppObjectiveCostRepository);
        this.dppObjectiveCostRepository = dppObjectiveCostRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.dppDevelopmentPartnersRepository = dppDevelopmentPartnersRepository;
        this.projectConceptClientService = projectConceptClientService;
        this.projectMovementRepository = projectMovementRepository;
        this.tappObjectiveCostRepository = tappObjectiveCostRepository;
        this.rdppRTappRevisedVersionRepository = rdppRTappRevisedVersionRepository;
        this.configurationClientService = configurationClientService;
        this.annualPhasingCostService = annualPhasingCostService;
        this.tappAnnualPhasingCostService = tappAnnualPhasingCostService;
        this.dppAnnualPhasingCostService = dppAnnualPhasingCostService;
        this.ppsDppTappClientService = ppsDppTappClientService;
        this.tappObjectiveCostService = tappObjectiveCostService;
        this.projectDetailsPartBService = projectDetailsPartBService;
        this.dppLocationService = dppLocationService;
        this.logFrameRepository = logFrameRepository;
        this.tappLogFrameRepository = tappLogFrameRepository;
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
            ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptByUuid(dppObjectiveCostDTO.getProjectConceptUuid());
            if (projectConceptResponse != null && projectConceptResponse.getId() > 0) {
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
                objectiveCost.setId(null);
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
                        developmentPartners.setId(null);
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
                RevisedVersionDTO rdppVersion = checkCurrentRdppVersion(projectConceptResponse.getUuid());
                objectiveCost.setRevisedVersion(rdppVersion.getCurrentVersion());
                objectiveCost.setRevisedVersionNumber(rdppVersion.getRevisedVersionNumber());

                // Save DppObjectiveCost Objects ;
                DppObjectiveCost newDppObjectiveCost = dppObjectiveCostRepository.save(objectiveCost);

                /* * saving primary movement stage * */
                AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();

                ProjectMovementStage projectMovementStage = new ProjectMovementStage();
                projectMovementStage.setCurrentStage(MovementStageEnum.valueOf("AGENCY_DESK"));
                projectMovementStage.setRdppMasterId(newDppObjectiveCost.getId());
                projectMovementStage.setIsDeleted(false);
                LocalDateTime localDateTime = LocalDateTime.now();
                projectMovementStage.setCreatedOn(localDateTime.toLocalDate());
                projectMovementStage.setMovementTime(localDateTime);
                projectMovementStage.setUuid(idGeneratorComponent.generateUUID());
                projectMovementStage.setUserId(Long.parseLong(accessTokenDetail.getId()));
                projectMovementRepository.save(projectMovementStage);
                /* * saving primary movement stage * */

                /* * saving Revision Version * */
                RdppRtappRevisedVersion rdppRtappRevisedVersion = new RdppRtappRevisedVersion();
                rdppRtappRevisedVersion.setCreatedOn(localDateTime.toLocalDate());
                rdppRtappRevisedVersion.setRevisionTime(LocalDate.now());
                rdppRtappRevisedVersion.setIsDeleted(false);
                rdppRtappRevisedVersion.setUuid(idGeneratorComponent.generateUUID());
                rdppRtappRevisedVersion.setRdppMasterId(newDppObjectiveCost.getId());
                rdppRtappRevisedVersion.setVersion(rdppVersion.getCurrentVersion());
                rdppRtappRevisedVersion.setPcUuid(projectConceptResponse.getUuid());
                rdppRTappRevisedVersionRepository.save(rdppRtappRevisedVersion);
                /* * saving Revision Version * */

                dppObjectiveCostDTO.setUuid(objectiveCost.getUuid());
                dppObjectiveCostDTO.setId(objectiveCost.getId());

                setPpsCode(projectConceptResponse, newDppObjectiveCost);

                return dppObjectiveCostDTO;
            } else {
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    private void setPpsCode(ProjectConceptResponse pcInfo, DppObjectiveCost rdpp) {
        //YYYY-SectorId-MinistryDivisionId-AgencyId-ProjectTypeId-Id

        Agency agencyDTO = configurationClientService.getAgencyByNameEn(pcInfo.getImplementingAgencyName());
        String ministryAgencyCode = (agencyDTO==null)?"":String.valueOf(agencyDTO.getMinistryDivision().getId()+agencyDTO.getId());
        String ppsCode = rdpp.getCreatedOn().getYear() + pcInfo.getSectorId().toString() + ministryAgencyCode + pcInfo.getProjectTypeId().toString() + rdpp.getId().toString();

        rdpp.setPpsCode(ppsCode);
        dppObjectiveCostRepository.save(rdpp);
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
            ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptByUuid(dppObjectiveCostDTO.getProjectConceptUuid());
            if (projectConceptResponse.getId() > 0) {
                pcMasterId = projectConceptResponse.getId();
                DppObjectiveCost objectiveCost = dppObjectiveCostRepository.findByUuidAndIsDeleted(dppObjectiveCostDTO.getUuid(), false).get();
                Long id = objectiveCost.getId();
                objectiveCost.setUpdatedBy("admin");
                objectiveCost.setIsDeleted(false);
                objectiveCost.setUpdatedOn(LocalDate.now());
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

    /**
     * Get Objective Cost By Pc uuid
     *
     * @param pcUuid
     * @return
     */
    @Transactional
    @Override
    public ResponseWithResults getObjectivesAndCostByPcUuidAndId(String pcUuid, Long id) {
        Optional<DppObjectiveCost> optional = dppObjectiveCostRepository.findByProjectConceptUuidAndIdAndIsDeleted(pcUuid, id,false);
        if (optional.isPresent()) {
            DppObjectiveCost objectiveCost = optional.get();

            DppObjectiveCostResponse response = new DppObjectiveCostResponse();

            BeanUtils.copyProperties(objectiveCost, response);
            response.setRevisedVersionBn(convertRevisedVersionBn(objectiveCost.getRevisedVersion()));

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
            List<DppObjectiveCostDates> dates = new ArrayList<>();
            List<DppObjectiveCost> objList = dppObjectiveCostRepository.findAllByProjectConceptMasterIdAndIsDeletedOrderById(objectiveCost.getProjectConceptMasterId(), false);
            for(DppObjectiveCost list : objList){
                if (objectiveCost.getId() != list.getId()){
                    DppObjectiveCostDates costDates = new DppObjectiveCostDates();
                    costDates.setDateCommencement(list.getDateCommencement());
                    costDates.setDateCompletion(list.getDateCompletion());
                    costDates.setRevisedVersion(list.getRevisedVersion());
                    costDates.setRdppMasterId(list.getId());
                    costDates.setRevisedVersionBn(convertRevisedVersionBn(list.getRevisedVersion()));
                    dates.add(costDates);
                }
            }
            response.setObjCostDates(dates);
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

    @Override
    public DppObjectiveCostDTO getObjectiveCostByPcUuid(String pcUuid) {
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
                    setUuid(objectiveCost.getUuid());
                    setRevisedVersion(objectiveCost.getRevisedVersion());
                }}).orElse(null) : null;
    }

    @Override
    public DppObjectiveCostDTO getObjectiveCostByRdppMasterId(Long rdppMasterId) {
        Optional<DppObjectiveCost> dppObjectiveCost = dppObjectiveCostRepository.findByIdAndIsDeleted(rdppMasterId, false);
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
                    setUuid(objectiveCost.getUuid());
                    setRevisedVersion(objectiveCost.getRevisedVersion());
                    setRevisedVersionBn(convertRevisedVersionBn(objectiveCost.getRevisedVersion()));
                    setReferenceId(objectiveCost.getReferenceId());
                    setReferenceUuid(objectiveCost.getReferenceUuid());
                    setMinistryDivision(objectiveCost.getMinistryDivision());
                    setImplementingAgency(objectiveCost.getImplementingAgency());
                    setModeFinanceList(convertmodeFinanceList(objectiveCost.getModeFinanceList()));
                }}).orElse(null) : null;
    }

    private List<DppModeFinancingDTO> convertmodeFinanceList(List<DppModeOfFinancing> modeFinanceList) {
        List<DppModeFinancingDTO> financeList = new ArrayList<>();
        for (DppModeOfFinancing financing : modeFinanceList) {
            DppModeFinancingDTO dto = new DppModeFinancingDTO();
            BeanUtils.copyProperties(financing, dto);
            financeList.add(dto);
        }
        return financeList;
    }

    @Override
    public AgencyDashboardDTO getAllStagesByPcIds(List<Long> ids) {
        List<MovementStageEnum> movementStageEnums = new ArrayList<>();
        for (DppObjectiveCost e : dppObjectiveCostRepository.findByProjectConceptMasterIdIn(ids)) {
            List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByRdppMasterIdOrderByMovementTimeDesc(e.getId());
            if (!projectMovementStageList.isEmpty()) {
                MovementStageEnum anEnum = projectMovementStageList.get(0).getCurrentStage();
                if (anEnum != null)
                    movementStageEnums.add(anEnum);
            }
        }
        for (TappObjectiveCost e : tappObjectiveCostRepository.findByProjectConceptMasterIdIn(ids)) {
            List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByRtappMasterIdOrderByMovementTimeDesc(e.getId());
            if (!projectMovementStageList.isEmpty()) {
                MovementStageEnum anEnum = projectMovementStageList.get(0).getCurrentStage();
                if (anEnum != null)
                    movementStageEnums.add(anEnum);
            }
        }
        AgencyDashboardDTO agencyDashboardDTO = new AgencyDashboardDTO();
        agencyDashboardDTO.setApprovedProjects(movementStageEnums.stream().filter(e -> e.equals(MovementStageEnum.APPROVED_BY_PLANNING_MINISTER)).count());
        agencyDashboardDTO.setSendToMinistryDivision(movementStageEnums.stream().filter(e -> e.equals(MovementStageEnum.PLANNING_MINISTER)).count());
        agencyDashboardDTO.setSendToPlanningCommission(movementStageEnums.stream().filter(e -> e.equals(MovementStageEnum.PLANNING_COMMISSION_HEAD)).count());
        agencyDashboardDTO.setRunningProject(movementStageEnums.stream().filter(e -> e.equals(MovementStageEnum.AGENCY_DESK)).count());
        return agencyDashboardDTO;
    }

    @Override
    public ResponseStatus linkFsReportWithDpp(FsLinkWithDto fsLinkWithDto) {
       Optional<DppObjectiveCost> dppObjectiveCostOptional =  dppObjectiveCostRepository.findByIdAndIsDeleted(fsLinkWithDto.getDppMasterId(), false);
       if(dppObjectiveCostOptional.isPresent()) {
          DppObjectiveCost dppObjectiveCost = dppObjectiveCostOptional.get();
          dppObjectiveCost.setFsUuid(fsLinkWithDto.getFsUuid());
          dppObjectiveCostRepository.save(dppObjectiveCost);
           return new ResponseStatus(200, "Successfully link with Dpp");
       } else {
           return new ResponseStatus(500, "Can't link with Dpp");
       }


    }

    @Transactional
    @Override
    public Page<DppObjectiveCostDTO> getRdppTappList(PageableRequestBodyDTO requestBodyDTO) {

        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        UserGroupResponse userGroup = configurationClientService.getUserGroupByUserId(Long.parseLong(accessTokenDetail.getId()));

        Page<DppObjectiveCost> ePage = Page.empty();
        Pageable pageable = this.getPageable(requestBodyDTO);

        if (userGroup.getAgency() != null) {
            ePage = dppObjectiveCostRepository.findAllByImplementingAgencyInAndStatusAndIsDeletedOrderByIdDesc(Arrays.asList(userGroup.getAgency().getNameEn(), userGroup.getAgency().getNameBn()), true,false, pageable);
//            ePage = dppObjectiveCostRepository.findAllByImplementingAgencyAndStatusAndIsDeletedOrderByIdDesc(userGroup.getAgency().getNameEn(), true,false, pageable);

        } else if (userGroup.getMinistryDivision() != null) {
            ePage = dppObjectiveCostRepository.findAllByMinistryDivisionInAndStatusAndIsDeletedOrderByIdDesc(Arrays.asList(userGroup.getMinistryDivision().getNameEn(),userGroup.getMinistryDivision().getNameBn()), true,false, pageable);
//            ePage = dppObjectiveCostRepository.findAllByMinistryDivisionAndStatusAndIsDeletedOrderByIdDesc(userGroup.getMinistryDivision().getNameEn(), true,false, pageable);

        } else if (userGroup.getSectorDivision() != null) {
            ePage = dppObjectiveCostRepository.findAllByConcernedDivisionIdAndStatusAndIsDeletedOrderByIdDesc(userGroup.getSectorDivision().getId(), true,false, pageable);

        } else if (userGroup.getPlanningMinister() != null) {
            ePage = dppObjectiveCostRepository.getRdppObjectiveCosByCurrentStage(Arrays.asList(MovementStageEnum.APPROVED_BY_PLANNING_MINISTER.ordinal(), MovementStageEnum.PLANNING_MINISTER.ordinal()), pageable);

        } else if (userGroup.getEcnec() != null) {
            ePage = dppObjectiveCostRepository.getRdppObjectiveCosByCurrentStage(Arrays.asList(MovementStageEnum.APPROVED_BY_PLANNING_MINISTER.ordinal(),
                    MovementStageEnum.APPROVED_BY_ECNEC.ordinal(), MovementStageEnum.ECNEC.ordinal(), MovementStageEnum.ECNEC_DESK.ordinal(), MovementStageEnum.ECNEC_OFFICERS.ordinal(),
                    MovementStageEnum.ECNEC_CONDITIONAL_APPROVE.ordinal(), MovementStageEnum.UNAPPROVED_BY_ECNEC.ordinal()), pageable);
        }

        Page<DppObjectiveCostDTO> resultPage =  new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
        if(!resultPage.isEmpty()){
            for (DppObjectiveCostDTO dppObjectiveCost : resultPage.getContent()) {
                List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByRdppMasterIdOrderByMovementTimeDesc(dppObjectiveCost.getId());
                dppObjectiveCost.setStatus(projectMovementStageList.size()>0?projectMovementStageList.get(0).getCurrentStage().name():"");

                ResponseEntity<List<GrandTotalResponse>> grandTotal = annualPhasingCostService.getGrandTotalByRdppMasterId(dppObjectiveCost.getId());
                for (GrandTotalResponse grandTotalResponse : grandTotal.getBody()) {
                    DppAnnualPhasingCostTotalDTO dppAnnualPhasingCostTotalDTO = new DppAnnualPhasingCostTotalDTO();
                    if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Grand_Total")) {
                        DppAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getDppAnnualPhasingCostTotal().get(0);
                        BeanUtils.copyProperties(annualCost, dppAnnualPhasingCostTotalDTO);
                        dppObjectiveCost.setGrandTotal(dppAnnualPhasingCostTotalDTO);
                    }
                }
            }
        }

        return resultPage;
    }

    @Override
    public Page<CommonDppTappSearch> searchRdppRtapp(SearchRequestDTO request) {
        List<CommonDppTappSearch> resultList = new ArrayList<>();
        List<CommonDppTappSearch> searchList = new ArrayList<>();
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Long id = Long.parseLong(accessTokenDetail.getId());
        UserGroupResponse userGroup = configurationClientService.getUserGroupByUserId(id);
        Pageable pageable = this.getPageable(request.getPageable());

        String agencyFilter = " ";
        String sectorDivision = " ";
        if (userGroup.getAgency() != null) {
            agencyFilter = "AND pcm.agency_id = " + userGroup.getAgency().getId() + " ";
        } else if (userGroup.getMinistryDivision() != null) {
            List<Agency> agency = configurationClientService.getByMinistryDivisionId(userGroup.getMinistryDivision().getId()).getBody();
            if (!agency.isEmpty()) {
                Set<Long> ids = agency.stream().map(UuidIdHolderRequestBodyDTO::getId).collect(Collectors.toSet());
                agencyFilter = "AND pcm.agency_id in (" + StringUtils.join(ids, ',') + ") ";
            }
        } else if (userGroup.getSectorDivision() != null) {
            sectorDivision = " AND pcm.sector_division_id = " + userGroup.getSectorDivision().getId() + " ";
        }

        String projectName = " ";
        if (request.getProjectName() != null) {
            projectName = " AND (LOWER(rm.project_title_en) like '%" + request.getProjectName().toLowerCase() + "%' OR LOWER(rm.project_title_bn) like '%" + request.getProjectName().toLowerCase() + "%') ";
        }

        String sector = " ";
        if (request.getSector() != null && request.getSector() != 0) {
            sector = " AND pcm.sector_id = " + request.getSector() + " ";
        }

        String status = " ";
        if (request.getStatus() != null) {
            status = " AND s.project_status = " + request.getStatus().ordinal() + " ";
        }

        String stageForAgency = "where 1=1" + status;
        String stageForMinistryDivision = "where s.project_status in (2,3,4,5,7,8,9,10,13,14,15,16,17,18,28)" + status;
        String stageForSectorDivision = "where s.project_status in (4,5,7,8,9,20,21,22,26,27,29)" + status;
        String stageForPlanningMinister = "where s.project_status > 5 and s.project_status < 10" + status;
        String stageForEcnec = "where (s.project_status > 7 and s.project_status < 10) OR (s.project_status > 23 and s.project_status < 28)" + status;

        String sql = "";
        if (userGroup.getAgency() != null) {
            sql = getSqlForRdppRtapp(pageable, request.getProjectType(), agencyFilter, projectName, sectorDivision, sector, "", "", stageForAgency);
        } else if (userGroup.getMinistryDivision() != null) {
            sql = getSqlForRdppRtapp(pageable, request.getProjectType(), agencyFilter, projectName, sectorDivision, sector, "", "", stageForMinistryDivision);
        } else if (userGroup.getSectorDivision() != null) {
            sql = getSqlForRdppRtapp(pageable, request.getProjectType(), agencyFilter, projectName, sectorDivision, sector, "", "", stageForSectorDivision);
        } else if (userGroup.getPlanningMinister() != null) {
            sql = getSqlForRdppRtapp(pageable, request.getProjectType(), agencyFilter, projectName, sectorDivision, sector, "", "", stageForPlanningMinister);
        } else if (userGroup.getEcnec() != null) {
            sql = getSqlForRdppRtapp(pageable, request.getProjectType(), agencyFilter, projectName, sectorDivision, sector, "", "", stageForEcnec);
        }

        Connection con = null;
        ResultSet rs = null;
        Statement stm = null;
        try{
            con = getOraConnection();
            stm = con.createStatement();
            rs = stm.executeQuery(sql);
            while (rs.next() && rs.getInt("total")>0) {
                CommonDppTappSearch data = new CommonDppTappSearch();
                data.setId(rs.getLong("id"));
                data.setCreatedBy(rs.getString("created_by"));
                data.setCreatedOn(rs.getDate("created_on").toLocalDate());
                data.setIsDeleted(rs.getBoolean("is_deleted"));
                data.setUpdatedBy(rs.getString("updated_by"));
                data.setUpdatedOn(rs.getDate("updated_on")==null?null:rs.getDate("updated_on").toLocalDate());
                data.setUuid(rs.getString("uuid"));
                data.setConcernedDivisionId(rs.getLong("concerned_division_id"));
                data.setCostExtension(rs.getBoolean("cost_extension"));
                data.setDateCommencement(rs.getDate("date_commencement").toLocalDate());
                data.setDateCompletion(rs.getDate("date_completion").toLocalDate());
                data.setImplementingAgency(rs.getString("implementing_agency"));
                data.setMinistryDivision(rs.getString("ministry_division"));
                data.setObjectivesTargets(rs.getString("objectives_targets"));
                data.setProjectConceptMasterId(rs.getLong("project_concept_master_id"));
                data.setProjectConceptUuid(rs.getString("project_concept_uuid"));
                data.setProjectTitleBn(rs.getString("project_title_bn"));
                data.setProjectTitleEn(rs.getString("project_title_en"));
                data.setReferenceId(rs.getLong("reference_id"));
                data.setReferenceUuid(rs.getString("reference_uuid"));
                data.setRevisedVersion(rs.getString("revised_version"));
                data.setStatus(rs.getBoolean("status"));
                data.setTimeExtension(rs.getBoolean("time_extension"));
                data.setProjectStatus(MovementStageEnum.values()[rs.getInt("project_status")]);
                data.setTotal(rs.getInt("total"));
                searchList.add(data);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (stm != null) {
                    stm.close();
                }
                if (con != null) {
                    con.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

//        EntityManager entityManager = entityManagerFactory.createEntityManager();
//        Query nativeQuery = entityManager.createNativeQuery(sql, CommonDppTappSearch.class);
//        List<CommonDppTappSearch> searchList = nativeQuery.getResultList();

        int total = 0;
        if(searchList.size()>0){
            for (CommonDppTappSearch objectiveCost : searchList) {
                if (objectiveCost != null) {
                    total = objectiveCost.getTotal();
                    if (request.getProjectType().equals("RDPP")) {
                        ResponseEntity<List<GrandTotalResponse>> grandTotal = annualPhasingCostService.getGrandTotalByRdppMasterId(objectiveCost.getId());
                        for (GrandTotalResponse grandTotalResponse : grandTotal.getBody()) {
                            DppAnnualPhasingCostTotalDTO dppAnnualPhasingCostTotalDTO = new DppAnnualPhasingCostTotalDTO();
                            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Grand_Total")) {
                                DppAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getAllGrandTotal();
                                BeanUtils.copyProperties(annualCost, dppAnnualPhasingCostTotalDTO);
                                objectiveCost.setGrandTotal(dppAnnualPhasingCostTotalDTO);
                            }
                        }
                    } else {
                        ResponseEntity<List<GrandTotalResponseTapp>> grandTotal = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(objectiveCost.getId());
                        for (GrandTotalResponseTapp grandTotalResponse : grandTotal.getBody()) {
                            DppAnnualPhasingCostTotalDTO dppAnnualPhasingCostTotalDTO = new DppAnnualPhasingCostTotalDTO();
                            if (grandTotalResponse.getComponentName().toString().equals("Grand_Total")) {
                                TappAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getAllGrandTotal();
                                BeanUtils.copyProperties(annualCost, dppAnnualPhasingCostTotalDTO);
                                objectiveCost.setGrandTotal(dppAnnualPhasingCostTotalDTO);
                            }
                        }
                    }

                    if (request.getLowAmount() != null && request.getHighAmount() != null) {
                        if (objectiveCost.getGrandTotal().getTotalAmount() >= request.getLowAmount() && objectiveCost.getGrandTotal().getTotalAmount() <= request.getHighAmount()) {
                            resultList.add(objectiveCost);
                        }
                    } else if (request.getLowAmount() != null) {
                        if (objectiveCost.getGrandTotal().getTotalAmount() >= request.getLowAmount()) {
                            resultList.add(objectiveCost);
                        }
                    } else if (request.getHighAmount() != null) {
                        if (objectiveCost.getGrandTotal().getTotalAmount() <= request.getHighAmount()) {
                            resultList.add(objectiveCost);
                        }
                    } else {
                        resultList.add(objectiveCost);
                    }
                }
            }
        }

        return new PageImpl<>(resultList, pageable, total);
    }

    private String getSqlForRdppRtapp(Pageable pageable, String projectType, String agency, String projectName, String sectorDivision, String sector, String lowAmount, String highAmount, String searchOnStage) {
        String tableName = "from rdpp_master rm ";
        String tableJoin = "and pms.rdpp_master_id = rm.id ";
        if (projectType.equals("RTAPP")) {
            tableName = "from rtapp_objective_cost rm ";
            tableJoin = "and pms.rtapp_master_id = rm.id ";
        }

        return "with cte as ( with selectedData as (" +
                "select rm.* , " +
                "(select pms.current_stage as project_status " +
                "from project_movement_stage pms " +
                "where pms.is_deleted = false " +
                tableJoin +
                "order by pms.movement_time desc limit 1)" +
                tableName +
                "join project_concept_master pcm on rm.project_concept_master_id = pcm.id " +
                "where rm.is_deleted = false " +
                agency + projectName + sectorDivision + sector +
                "order by rm.id desc) select * from selectedData s " +
                searchOnStage +
                ") select * from  (TABLE cte " +
                "LIMIT " + pageable.getPageSize() + " OFFSET " + pageable.getOffset() + ") sub " +
                "RIGHT  JOIN (SELECT count(*) FROM cte) c(total) ON true";

    }

    @Override
    public RevisedVersionDTO checkCurrentRdppVersion(String pcUuid) {
        String version = "";
        String previousVersion = "";
        RevisedVersionDTO versionDTO = new RevisedVersionDTO();
        List<RdppRtappRevisedVersion> rtappRevisedVersionList = rdppRTappRevisedVersionRepository.findAllByPcUuid(pcUuid);
        if(rtappRevisedVersionList.isEmpty()) {
            versionDTO.setCurrentVersion("1st Revised");
            versionDTO.setCurrentVersionBn("১ম সংশোধিত");
            versionDTO.setPreviousVersion("Original");
            versionDTO.setPreviousVersionBn("মূল");
            versionDTO.setRevisedVersionNumber(rtappRevisedVersionList.size()+1);
            return versionDTO;
        }
        int size = rtappRevisedVersionList.size();
        if(size == 1) {
            version = "2nd Revised";
            previousVersion = "1st Revised";
        } else if(size == 2) {
            version = "3rd Revised";
            previousVersion = "2nd Revised";
        } else if(size == 3) {
            version = "4th Revised";
            previousVersion = "3rd Revised";
        } else {
            size = size + 1;
            version = size + "th Revised";
            previousVersion = size-1 + "th Revised";
        }

        versionDTO.setCurrentVersion(version);
        versionDTO.setPreviousVersion(previousVersion);
        versionDTO.setRevisedVersionNumber(rtappRevisedVersionList.size()+1);
        versionDTO.setCurrentVersionBn(convertRevisedVersionBn(version));
        versionDTO.setPreviousVersionBn(convertRevisedVersionBn(previousVersion));

        return versionDTO;
    }

    private String convertRevisedVersionBn(String version){
        if (version.isEmpty()) return "";
        String bnVersion = "";
        switch(version) {
            case "Original":
                bnVersion ="মূল";
                break;
            case "1st Revised":
                bnVersion ="১ম সংশোধিত";
                break;
            case "2nd Revised":
                bnVersion ="২য় সংশোধিত";
                break;
            case "3rd Revised":
                bnVersion ="৩য় সংশোধিত";
                break;
            case "4th Revised":
                bnVersion = "৪র্থ  সংশোধিত";
                break;
            case "5th Revised":
                bnVersion = "৫ম সংশোধিত";
                break;
            case "6th Revised":
                bnVersion = "৬ষ্ঠ সংশোধিত";
                break;
            case "7th Revised":
                bnVersion = "৭ম সংশোধিত";
                break;
            case "8th Revised":
                bnVersion = "৮ম সংশোধিত";
                break;
            case "9th Revised":
                bnVersion = "৯ম সংশোধিত";
                break;
            case "10th Revised":
                bnVersion = "১০ম সংশোধিত";
                break;
            default:
                String versionStr = version.substring(0, 2);
                bnVersion = convertToNumberBn(versionStr) + "তম সংশোধিত";
                break;
        }
        return bnVersion;
    }

    private String convertToNumberBn(String number) {
        return number.replaceAll("0","০").replaceAll("1","১").replaceAll("2","২").replaceAll("3","৩").replaceAll("4","৪").replaceAll("5","৫").replaceAll("6","৬").replaceAll("7","৭").replaceAll("8","৮").replaceAll("9","৯");
    }

    @Override
    public String checkCurrentProjectVersion(Long id) {
        Optional<RdppRtappRevisedVersion> projectVersion = rdppRTappRevisedVersionRepository.findByRdppMasterId(id);
        if(projectVersion.isPresent()) {
            return projectVersion.get().getVersion();
        }
        return "Data Not Found";
    }

    @Override
    public String getCumulativeDate(Long id, String pcUuid) {
        Optional<DppObjectiveCost> dppObjectiveCostOptional = dppObjectiveCostRepository.findByProjectConceptUuidAndIdAndIsDeleted(pcUuid, id, false);
        LocalDate cumulativeLocalDate = null;
        String cumulativeDate;
        if (dppObjectiveCostOptional.isPresent()) {
            DppObjectiveCost dppObjectiveCost = dppObjectiveCostOptional.get();
            cumulativeLocalDate = dppObjectiveCost.getCumulativeDate();
        }
        cumulativeDate = String.valueOf(cumulativeLocalDate);
        return cumulativeDate;
    }

    @Override
    public List<ProjectListResponseDTO> getApprovedRdppRtapp() {
        List<ProjectListResponseDTO> result = new ArrayList<>();
        List<DppObjectiveCost> dppList = dppObjectiveCostRepository.findAllApprovedRdppAndIsDeleted();
        List<TappObjectiveCost> tappList = tappObjectiveCostRepository.findAllApprovedRtppAndIsDeleted();

        result.addAll(dppList.stream().
                map(o -> new ProjectListResponseDTO(o.getPpsCode(), o.getProjectTitleEn(), "RDPP"))
                .collect(Collectors.toList()));

        result.addAll(tappList.stream().
                map(o -> new ProjectListResponseDTO(o.getPpsCode(), o.getProjectTitleEn(), "RTAPP"))
                .collect(Collectors.toList()));

        return result;
    }

    @Override
    public ApprovalAndNotApprovalProjectListResponseDTO getApprovedNotApprovedRdppRtapp() {
        ApprovalAndNotApprovalProjectListResponseDTO response = new ApprovalAndNotApprovalProjectListResponseDTO();
        List<DppObjectiveCost> dppListApproval = dppObjectiveCostRepository.findAllApprovedRdppAndIsDeleted();
        List<TappObjectiveCost> tappListApproval = tappObjectiveCostRepository.findAllApprovedRtppAndIsDeleted();
        List<DppObjectiveCost> dppListNotApproval = dppObjectiveCostRepository.findAllNotApprovedRdppAndIsDeleted();
        List<TappObjectiveCost> tappListNotApproval = tappObjectiveCostRepository.findAllNotApprovedRtppAndIsDeleted();
        response.setRdppApprovedList(dppListApproval);
        response.setRtappApprovedList(tappListApproval);
        response.setRdppNotApprovedList(dppListNotApproval);
        response.setRtappNotApprovedList(tappListNotApproval);

        return response;
    }

    @Override
    public ResponseStatusDTO ecnecApprovalProjectAcknowledgement(ProjectListDTO projectDTO) {
        ResponseStatusDTO response = new ResponseStatusDTO("fail", "Project not found");
        if (projectDTO.getProjectType().equals("RDPP")) {
            return ecnecRdppApprovalProjectAcknowledgement(projectDTO);
        } else if (projectDTO.getProjectType().equals("RTAPP")) {
            return tappObjectiveCostService.ecnecRtappApprovalProjectAcknowledgement(projectDTO);
        }

        return response;
    }

    public ResponseStatusDTO ecnecRdppApprovalProjectAcknowledgement(ProjectListDTO projectDTO) {
        ResponseStatusDTO response = new ResponseStatusDTO("success", "Successfully project acknowledged with ECNEC");
        DppObjectiveCost rdppInfo = dppObjectiveCostRepository.findByPpsCodeAndIsDeleted(projectDTO.getPpsCode(), false);
        if (rdppInfo != null) {
            if (rdppInfo.getIsEcnecAcknowledgement() == null || !rdppInfo.getIsEcnecAcknowledgement()) {
                rdppInfo.setIsEcnecAcknowledgement(true);
                rdppInfo.setEcnecId(projectDTO.getEcnecId());
                dppObjectiveCostRepository.save(rdppInfo);
            } else if (rdppInfo.getIsEcnecAcknowledgement()) {
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
    public EcnecProjectInfoDTO getProjectInfoByProjectCode(String projectCode, String projectType) {
        EcnecProjectInfoDTO result = new EcnecProjectInfoDTO();
        if (projectType.equals("RDPP")) {
            DppObjectiveCost rdppInfo = dppObjectiveCostRepository.findByPpsCodeAndIsDeleted(projectCode, false);
            if (rdppInfo != null) {
                setRdppInfo(rdppInfo, result);
            }
        } else if (projectType.equals("RTAPP")) {
            TappObjectiveCost rtappInfo = tappObjectiveCostRepository.findByPpsCodeAndIsDeleted(projectCode, false);
            if (rtappInfo != null) {
                setRtappInfo(rtappInfo, result);
            }
        }

        return result;
    }

    private void setRdppInfo(DppObjectiveCost rdppInfo, EcnecProjectInfoDTO result) {
        result.setProjectName(rdppInfo.getProjectTitleEn());
        result.setProjectNameBn(rdppInfo.getProjectTitleBn());
        result.setStartDate(rdppInfo.getCumulativeDate());
        result.setEndDate(rdppInfo.getDateCompletion());

        //TODO: rename
        ProjectConceptResponse pcInfo = projectConceptClientService.getProjectConceptByUuid(rdppInfo.getProjectConceptUuid());
        List<ProjectMovementStage> stageList = projectMovementRepository.findByRdppMasterIdOrderByMovementTimeDesc(rdppInfo.getId());
        result.setApprovalDate(stageList.size()>0 ? stageList.get(0).getMovementTime() : null);
        ProjectDetailsPartB projectDetails = projectDetailsPartBService.getProjectDetailsByProjectId(rdppInfo.getProjectConceptUuid());
        result.setPeojectActivity(projectDetails==null?"": Jsoup.parse(projectDetails.getActivities()).text());
        SectorDTO sector = configurationClientService.getBySectorId(pcInfo.getSectorId());
        SectorDivision sectorDivision = configurationClientService.getBySectorDivisionId(pcInfo.getSectorDivisionId());
        MinistryDivisionDTO ministry = configurationClientService.getMinistryByNameEn(rdppInfo.getMinistryDivision());
        Agency agency = configurationClientService.getAgencyByNameEn(rdppInfo.getImplementingAgency());
        ArrayList<String> arrayList = new ArrayList<>();
        arrayList.add(agency == null ? rdppInfo.getImplementingAgency() : agency.getNameEn());

        result.setCode(rdppInfo.getPpsCode());
        result.setApprovalStatus("Approved");
        result.setRevised(true);
        result.setRevisedNumber(rdppInfo.getRevisedVersionNumber());
//        result.setParentProjectCode("");
        result.setSourceType("RDPP");
        result.setSponsoringMinistry(ministry == null ? rdppInfo.getMinistryDivision() : ministry.getNameEn());
        result.setImplementingAgency(arrayList);
        result.setPlanningDivision(sectorDivision.getSectorDivisionNameBn());
        result.setSector(sector.getSectorNameBn());
        result.setProjectType("RDPP");
        result.setEcnecProjectId(rdppInfo.getEcnecId());
//        AssignEcnecMeeting meeting = assignEcnecMeetingService.findByPcUuidAndIsDeleted(pcInfo.getUuid());
//        result.setMeetingDate(meeting==null ? null : meeting.getEcnecMeeting().getMeetingDate());
//        result.setEcnecMeetingNumber(meeting==null ? 0 : 1);
        result.setEcnecMeetingNumber(0);
        result.setSummary("");
        result.setBenefits("");

        if (rdppInfo.getDevelopmentPartnersList()!=null && rdppInfo.getDevelopmentPartnersList().size()>0) {
            Long partnerId = rdppInfo.getDevelopmentPartnersList().get(0).getDevPartnerId();
            DevelopmentPartnerResponse developmentPartner = configurationClientService.getDevelopmentPartnerById(partnerId);
            result.setProjectAidSourceName(developmentPartner==null?"":developmentPartner.getDevelopmentPartnerName());
        }
        setDppLocationData(rdppInfo, result);

        Optional<DppLogFrame> logFrame = logFrameRepository.findByRdppMasterId(rdppInfo.getId());
        if (logFrame.isPresent()) {
            DppLogFrame dppLogFrame = logFrame.get();
            result.setPeojectPurpose(Jsoup.parse(dppLogFrame.getObjectiveNS()).text());
        }

        final DecimalFormat decimalFormat = new DecimalFormat("0.00");
        ResponseEntity<List<GrandTotalResponse>> grandTotalList = dppAnnualPhasingCostService.getGrandTotalByRdppMasterId(rdppInfo.getId());
        for (GrandTotalResponse grandTotalResponse : Objects.requireNonNull(grandTotalList.getBody())) {
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Grand_Total")) {
                DppAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getDppAnnualPhasingCostTotal().get(0);
                Double paAmount = annualCost.getGobThruAmount()+annualCost.getSpAcAmount()+annualCost.getThruPdAmount()+annualCost.getThruDpAmount();
                result.setRvTotalProjectCost(Double.valueOf(decimalFormat.format(annualCost.getTotalAmount())));
                result.setRvGob(annualCost.getGobAmount());
                result.setRvProjectAid(paAmount);
                result.setRvOwnFund(annualCost.getOwnFundAmount());
                result.setRvOther(annualCost.getOtherAmount());
                result.setMinistryProject(annualCost.getTotalAmount()<=500);
                result.setFastTrackProject(annualCost.getTotalAmount()>=500);
                setSourceOfFinance(result, annualCost.getGobAmount(), paAmount, annualCost.getOwnFundAmount(), annualCost.getOtherAmount());
                break;
            }
        }

        if (result.getRevisedNumber() > 1) {
            ResponseEntity<List<GrandTotalResponse>> previousGrandTotalList = dppAnnualPhasingCostService.getGrandTotalByRdppMasterId(rdppInfo.getReferenceId());
            for (GrandTotalResponse grandTotalResponse : Objects.requireNonNull(previousGrandTotalList.getBody())) {
                if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Grand_Total")) {
                    DppAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getDppAnnualPhasingCostTotal().get(0);
                    Double paAmount = annualCost.getGobThruAmount()+annualCost.getSpAcAmount()+annualCost.getThruPdAmount()+annualCost.getThruDpAmount();
                    result.setTotalProjectCost(Double.valueOf(decimalFormat.format(annualCost.getTotalAmount())));
                    result.setGob(annualCost.getGobAmount());
                    result.setProjectAid(paAmount);
                    result.setOwnFund(annualCost.getOwnFundAmount());
                    result.setOther(annualCost.getOtherAmount());
                    break;
                }
            }
        } else {
            result.setParentProjectCode(rdppInfo.getProjectConceptMasterId().toString());
        }
    }

    private void setRtappInfo(TappObjectiveCost rtappInfo, EcnecProjectInfoDTO result) {
        result.setProjectName(rtappInfo.getProjectTitleEn());
        result.setProjectNameBn(rtappInfo.getProjectTitleBn());
        result.setStartDate(rtappInfo.getCumulativeDate());
        result.setEndDate(rtappInfo.getDateCompletion());

        ProjectConceptResponse pcInfo22 = projectConceptClientService.getProjectConceptByUuid(rtappInfo.getProjectConceptUuid());
        List<ProjectMovementStage> stageList = projectMovementRepository.findByRtappMasterIdOrderByMovementTimeDesc(rtappInfo.getId());
        result.setApprovalDate(stageList.size()>0 ? stageList.get(0).getMovementTime() : null);
//        DevelopmentPartnerResponse developmentPartner = configurationClientService.getDevelopmentPartnerById(Long.valueOf(rtappInfo.getDevelopmentPartnerId()));
//        result.setProjectAidSourceName(developmentPartner==null?"":developmentPartner.getDevelopmentPartnerName());

        SectorDTO sector = configurationClientService.getBySectorId(pcInfo22.getSectorId());
        SectorDivision sectorDivision = configurationClientService.getBySectorDivisionId(pcInfo22.getSectorDivisionId());
        MinistryDivisionDTO ministry = configurationClientService.getMinistryByNameEn(rtappInfo.getMinistryDivision());
        Agency agency = configurationClientService.getAgencyByNameEn(rtappInfo.getImplementingAgency());
        ArrayList<String> arrayList = new ArrayList<>();
        arrayList.add(agency == null ? rtappInfo.getImplementingAgency() : agency.getNameBn());

        result.setCode(rtappInfo.getPpsCode());
        result.setApprovalStatus("Approved");
        result.setRevised(true);
        result.setRevisedNumber(rtappInfo.getRevisedVersionNumber());
        result.setParentProjectCode("");
        result.setSourceType("RTAPP");
        result.setSponsoringMinistry(ministry == null ? rtappInfo.getMinistryDivision() : ministry.getNameBn());
        result.setImplementingAgency(arrayList);
        result.setPlanningDivision(sectorDivision.getSectorDivisionNameBn());
        result.setSector(sector.getSectorNameBn());
        result.setProjectType("RTAPP");
        result.setEcnecProjectId(rtappInfo.getEcnecId());
//        AssignEcnecMeeting meeting = assignEcnecMeetingService.findByPcUuidAndIsDeleted(pcInfo.getUuid());
//        result.setMeetingDate(meeting==null ? null : meeting.getEcnecMeeting().getMeetingDate());
//        result.setEcnecMeetingNumber(meeting==null ? 0 : 1);
        result.setEcnecMeetingNumber(0);
        result.setSummary("");
        result.setBenefits("");

        Optional<TappLogFrame> logFrame = tappLogFrameRepository.findByPcUuid(rtappInfo.getProjectConceptUuid());
        if (logFrame.isPresent()) {
            TappLogFrame tappLogFrame = logFrame.get();
            result.setPeojectPurpose(Jsoup.parse(tappLogFrame.getObjectiveNS()).text());
        }

        final DecimalFormat decimalFormat = new DecimalFormat("0.00");
        ResponseEntity<List<GrandTotalResponseTapp>> grandTotal = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(rtappInfo.getId());
        for (GrandTotalResponseTapp grandTotalResponse : grandTotal.getBody()) {
            if (grandTotalResponse.getComponentName().toString().equals("Grand_Total")) {
                TappAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
                Double paAmount = annualCost.getGobThruAmount()+annualCost.getSpAcAmount()+annualCost.getThruPdAmount()+annualCost.getThruDpAmount();
                result.setRvTotalProjectCost(Double.valueOf(decimalFormat.format(annualCost.getTotalAmount())));
                result.setRvGob(annualCost.getGobAmount());
                result.setRvProjectAid(paAmount);
                result.setRvOwnFund(annualCost.getOwnFundAmount());
                result.setRvOther(annualCost.getOtherAmount());

                result.setMinistryProject(annualCost.getTotalAmount()<=500);
                result.setFastTrackProject(annualCost.getTotalAmount()>=500);
                setSourceOfFinance(result, annualCost.getGobAmount(), paAmount, annualCost.getOwnFundAmount(), annualCost.getOtherAmount());
                break;
            }
        }

        if (result.getRevisedNumber() > 1) {
            ResponseEntity<List<GrandTotalResponseTapp>> previousGrandTotalList = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(rtappInfo.getId());
            for (GrandTotalResponseTapp grandTotalResponse : previousGrandTotalList.getBody()) {
                if (grandTotalResponse.getComponentName().toString().equals("Grand_Total")) {
                    TappAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
                    Double paAmount = annualCost.getGobThruAmount()+annualCost.getSpAcAmount()+annualCost.getThruPdAmount()+annualCost.getThruDpAmount();
                    result.setTotalProjectCost(Double.valueOf(decimalFormat.format(annualCost.getTotalAmount())));
                    result.setGob(annualCost.getGobAmount());
                    result.setProjectAid(paAmount);
                    result.setOwnFund(annualCost.getOwnFundAmount());
                    result.setOther(annualCost.getOtherAmount());
                    break;
                }
            }
        }  else {
            result.setParentProjectCode(rtappInfo.getProjectConceptMasterId().toString());
        }
    }

    private void setSourceOfFinance(EcnecProjectInfoDTO result, Double gobAmount, Double paAmount, Double ownAmount, Double otherAmount) {
        Double maxAmount = Math.max(Math.max(gobAmount, paAmount), Math.max(ownAmount, otherAmount));
        if (Double.compare(maxAmount, gobAmount) == 0) {
            result.setSourceOfFinance("GOB");
        } else if (Double.compare(maxAmount, paAmount) == 0) {
            result.setSourceOfFinance("Project Aid");
        } else if (Double.compare(maxAmount, ownAmount) == 0) {
            result.setSourceOfFinance("Own Source");
        } else if (Double.compare(maxAmount, otherAmount) == 0) {
            result.setSourceOfFinance("Other Source");
        }
    }

    private void setDppLocationData(DppObjectiveCost dppInfo, EcnecProjectInfoDTO result) {
        DppLocationResponse dppLocation = dppLocationService.getByProjectSummaryId(dppInfo.getProjectConceptMasterId());
        if (dppLocation!=null && dppLocation.getDivisions() != null) {
            List<DivisionGeoDTO> divisionList = dppLocation.getDivisions().stream().map(division -> new DivisionGeoDTO() {{
                setName(division.getNameBn());
                setGeoCode(division.getGeoCode());
                setDistrict(new ArrayList<>());
            }}).collect(Collectors.toList());

            for (ZillaRequest districtDTO: dppLocation.getZillas()) {
                for (DivisionGeoDTO division: divisionList) {
                    if (districtDTO.getDivision().getGeoCode().equals(division.getGeoCode())) {
                        List<UpazilaGeoDTO> upazilaList = new ArrayList<>();
                        for (UpaZillaRequest upazila: dppLocation.getUpazilas()) {
                            if (upazila.getZilla().getGeoCode().equals(districtDTO.getGeoCode())) {
                                UpazilaGeoDTO upa = new UpazilaGeoDTO();
                                upa.setName(upazila.getNameBn());
                                upa.setGeoCode(upazila.getGeoCode());
                                upazilaList.add(upa);
                            }
                        }

                        DistrictGeoDTO district = new DistrictGeoDTO();
                        district.setName(districtDTO.getNameBn());
                        district.setGeoCode(districtDTO.getGeoCode());
                        district.setUpazila(upazilaList);
                        division.getDistrict().add(district);
                    }
                }
            }

            result.setLocation(divisionList);
        }
    }



    @Override
    public Optional<DppObjectiveCost> findById(Long id) {
        return dppObjectiveCostRepository.findByIdAndIsDeleted(id, false);
    }

    @Override
    public Optional<DppObjectiveCost> findByReferenceId(Long referenceId){
        return dppObjectiveCostRepository.findByReferenceIdAndIsDeleted(referenceId, false);
    }

    @Override
    public Optional<DppObjectiveCost> findByReferenceIdAndAgencyId(Long referenceId, Long agencyId){
        return dppObjectiveCostRepository.findByReferenceIdAndAgencyIdAndIsDeleted(referenceId, agencyId, false);
    }

    @Override
    public Optional<DppObjectiveCost> findByProjectConceptId(Long projectConceptId){
        List<DppObjectiveCost> dppObjectiveCostList = dppObjectiveCostRepository.findAllByProjectConceptMasterIdAndIsDeleted(projectConceptId, false);
        if ( CollectionUtils.isEmpty(dppObjectiveCostList) ){
            return Optional.empty();
        } else {
            return Optional.of(dppObjectiveCostList.get(0));
        }
    }

    @Override
    public DppObjectiveCostDTO getObjectiveCostByReferenceUuid(String referenceUuid) {
        Optional<DppObjectiveCost> dppObjectiveCost = dppObjectiveCostRepository.findByReferenceUuidAndIsDeleted(referenceUuid, false);

        if (dppObjectiveCost.isPresent()){
            DppObjectiveCostDTO dppObjectiveCostDTO = new DppObjectiveCostDTO();
            BeanUtils.copyProperties(dppObjectiveCost.get(), dppObjectiveCostDTO);
            return dppObjectiveCostDTO;
        }
        return null;
    }

    @Override
    public ResponseWithResults getObjectiveCostByUuid(String uuid) {
        Optional<DppObjectiveCost> dppObjectiveCost = dppObjectiveCostRepository.findByUuidAndIsDeleted(uuid, false);
        if (dppObjectiveCost.isPresent()) {
            DppObjectiveCost objectiveCost = dppObjectiveCost.get();

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

    @Override
    public List<DppAnnualPhasingCostTotalDTO> getEstimatedCost(String pcUuid) {
        List<DppObjectiveCost> objList = dppObjectiveCostRepository.findAllByProjectConceptUuidAndIsDeletedOrderByIdAsc(pcUuid, false);

        /** (Estimated Cost of the project calculation) */
        List<DppAnnualPhasingCostTotalDTO> estimatedCost = new ArrayList<>();
        /** Dpp Grand Total or original annual phasing cost  */
        ResponseEntity<List<GrandTotalResponse>> dppGrandTotall = ppsDppTappClientService.getGrandTotalByProjectConceptId(objList.get(0).getProjectConceptMasterId());
        DppAnnualPhasingCostTotalDTO a = grandTotalCal(dppGrandTotall, "DPP");
        a.setDateCommencement(objList.get(0).getDateCommencement());
        a.setDateCompletion(objList.get(0).getDateCompletion());
        a.setRevisedVersion("Original");
        estimatedCost.add(a);

        /** Annual Phasing cost Previous revised Data get here */
        for (int i = 0; i < objList.size(); i++) {
            DppObjectiveCost val = objList.get(i);
            if (val.getReferenceId() != null) {
                ResponseEntity<List<GrandTotalResponse>> grandTotal2 = dppAnnualPhasingCostService.getGrandTotalByRdppMasterId(val.getReferenceId());
                DppAnnualPhasingCostTotalDTO dppDto = grandTotalCal(grandTotal2, "RDPP");
                DppObjectiveCost preVal = objList.get(i - 1);
                dppDto.setDateCommencement(preVal.getDateCommencement());
                dppDto.setDateCompletion(preVal.getDateCompletion());
                dppDto.setRevisedVersion(preVal.getRevisedVersion());
                estimatedCost.add(dppDto);
            }
        }


        /** Annual Phasing cost proposed Data set here */
        DppObjectiveCost lastIndex = objList.get(objList.size() - 1);
        ResponseEntity<List<GrandTotalResponse>> grandTotal3 = dppAnnualPhasingCostService.getGrandTotalByRdppMasterId(lastIndex.getId());
        DppAnnualPhasingCostTotalDTO dDto = grandTotalCal(grandTotal3, "RDPP");
        dDto.setDateCommencement(lastIndex.getDateCommencement());
        dDto.setDateCompletion(lastIndex.getDateCompletion());
        dDto.setRevisedVersion(lastIndex.getRevisedVersion());
        estimatedCost.add(dDto);

        /** Revised start Year and End year set for Year wise Estimated cost table */
        List<DppAnnualPhasingCostTotalDTO> estimated = new ArrayList<>();
        for (int i = 0; i < estimatedCost.size(); i++) {
            DppAnnualPhasingCostTotalDTO dto = estimatedCost.get(i);
            if (i == 0) {
                Long startYear = Long.valueOf(dto.getDateCommencement().getYear());
                dto.setRevisedStartYear(startYear);
            }
            if (i > 0) {
                DppAnnualPhasingCostTotalDTO preVal = estimatedCost.get(i - 1);
                Long startYear2 = Long.valueOf(preVal.getDateCompletion().getYear());
                dto.setRevisedStartYear(startYear2);
            }
            Long endYear = Long.valueOf(dto.getDateCompletion().getYear());
            dto.setRevisedEndYear(endYear);
            estimated.add(dto);
        }

        return estimated;
    }


    /** Grand Total Amount Calculation here */
    private DppAnnualPhasingCostTotalDTO grandTotalCal(ResponseEntity<List<GrandTotalResponse>> grandTotal, String type) {
        DppAnnualPhasingCostTotalDTO annualCost = new DppAnnualPhasingCostTotalDTO();
        for (GrandTotalResponse grandTotalResponse : grandTotal.getBody()) {
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Grand_Total")) {
                DppAnnualPhasingCostTotalDTO annualCostCopy = null;
                if (type.equals("DPP")) {
                    annualCostCopy = grandTotalResponse.getDppAnnualPhasingCostTotal().get(0);
                } else {
                    annualCostCopy = grandTotalResponse.getAllGrandTotal();
                }
                BeanUtils.copyProperties(annualCostCopy, annualCost);

                DecimalFormat df=new DecimalFormat("#.##");
                df.setRoundingMode(RoundingMode.HALF_UP);
                annualCost.setTotalAmount(Double.valueOf(df.format(annualCost.getTotalAmount())));
                annualCost.setGobAmount(Double.valueOf(df.format(annualCost.getGobAmount())));
                annualCost.setGobFeAmount(Double.valueOf(df.format(annualCost.getGobFeAmount())));
                annualCost.setGobThruAmount(Double.valueOf(df.format(annualCost.getGobThruAmount())));
                annualCost.setSpAcAmount(Double.valueOf(df.format(annualCost.getSpAcAmount())));
                annualCost.setThruPdAmount(Double.valueOf(df.format(annualCost.getThruPdAmount())));
                annualCost.setThruDpAmount(Double.valueOf(df.format(annualCost.getThruDpAmount())));
                annualCost.setOwnFundAmount(Double.valueOf(df.format(annualCost.getOwnFundAmount())));
                annualCost.setOwnFundFeAmount(Double.valueOf(df.format(annualCost.getOwnFundFeAmount())));
                annualCost.setOtherAmount(Double.valueOf(df.format(annualCost.getOtherAmount())));
                annualCost.setOtherFeAmount(Double.valueOf(df.format(annualCost.getOtherFeAmount())));
                annualCost.setPaAmount(Double.valueOf(df.format(paAmountCal(annualCost))));
            }
        }
        return annualCost;
    }

    /** PA Amount Calculation here */
    private double paAmountCal(DppAnnualPhasingCostTotalDTO item) {
        double paAmount = 0;
        paAmount = item.getSpAcAmount() + item.getGobThruAmount() + item.getThruDpAmount() + item.getThruPdAmount();
        return paAmount;
    }

    public Connection getOraConnection() {
        Connection connection = null;
        String driverClassName = env.getProperty("spring.datasource.driver-class-name");
        String url = env.getProperty("spring.datasource.url");
        String username = env.getProperty("spring.datasource.username");
        String password = env.getProperty("spring.datasource.password");

        try {
            Class.forName(driverClassName);
        } catch (ClassNotFoundException e) {
            System.out.println("Where is your Oracle JDBC Driver?");
        }

        try {
            connection = DriverManager.getConnection(url, username, password);
        } catch (SQLException e) {
            System.out.println("Connection Failed! Check output console");
        }
        if (connection != null) {
            return connection;
        } else {
            System.out.println("Failed to make connection!");
            return null;
        }
    }
}


