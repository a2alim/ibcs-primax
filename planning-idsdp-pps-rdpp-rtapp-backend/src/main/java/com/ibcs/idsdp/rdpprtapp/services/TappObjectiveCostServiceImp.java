package com.ibcs.idsdp.rdpprtapp.services;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
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
import com.ibcs.idsdp.rdpprtapp.model.domain.*;
import com.ibcs.idsdp.rdpprtapp.model.repositories.RdppRTappRevisedVersionRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappDevelopmentPartnersRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappModeOnFinanceRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.rdpprtapp.services.implementation.TappAnnualPhasingCostServiceImpl;
import com.ibcs.idsdp.rdpprtapp.web.dto.*;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.ProjectListDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
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
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class TappObjectiveCostServiceImp extends BaseService<TappObjectiveCost, TappObjectiveCostDTO> implements TappObjectiveCostService {

    private final TappObjectiveCostRepository tappObjectiveCostRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private ProjectConceptClientService projectConceptClientService;
    private TappModeOnFinanceRepository tappModeOnFinanceRepository;
    private TappDevelopmentPartnersRepository tappDevelopmentPartnersRepository;
    private ProjectMovementRepository projectMovementRepository;
    private RdppRTappRevisedVersionRepository rdppRTappRevisedVersionRepository;

    private ConfigurationClientService configurationClientService;
    private TappAnnualPhasingCostServiceImpl annualPhasingCostServiceImpl;
    private final PpsDppTappClientService ppsDppTappClientService;
    private final TappAnnualPhasingCostService tappAnnualPhasingCostService;

    public TappObjectiveCostServiceImp(TappObjectiveCostRepository tappObjectiveCostRepository, IdGeneratorComponent idGeneratorComponent,
                                       ProjectConceptClientService projectConceptClientService, TappModeOnFinanceRepository tappModeOnFinanceRepository,
                                       TappDevelopmentPartnersRepository tappDevelopmentPartnersRepository, ProjectMovementRepository projectMovementRepository,
                                       RdppRTappRevisedVersionRepository rdppRTappRevisedVersionRepository, ConfigurationClientService configurationClientService,
                                       TappAnnualPhasingCostServiceImpl annualPhasingCostServiceImpl, PpsDppTappClientService ppsDppTappClientService,
                                       TappAnnualPhasingCostService tappAnnualPhasingCostService) {
        super(tappObjectiveCostRepository);
        this.tappObjectiveCostRepository = tappObjectiveCostRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.projectConceptClientService = projectConceptClientService;
        this.tappModeOnFinanceRepository = tappModeOnFinanceRepository;
        this.tappDevelopmentPartnersRepository = tappDevelopmentPartnersRepository;
        this.projectMovementRepository = projectMovementRepository;
        this.rdppRTappRevisedVersionRepository = rdppRTappRevisedVersionRepository;
        this.configurationClientService = configurationClientService;
        this.annualPhasingCostServiceImpl = annualPhasingCostServiceImpl;
        this.ppsDppTappClientService = ppsDppTappClientService;
        this.tappAnnualPhasingCostService = tappAnnualPhasingCostService;
    }

    //Save Method For TappObjectiveCost;
    @Override
    public ResponseWithResults createObjectiveCost(TappObjectiveCostDTO tappObjectiveCostDTO) {
        Long pcMasterId = 0L;
        ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptByUuid(tappObjectiveCostDTO.getProjectConceptUuid());
        if (projectConceptResponse.getId() > 0) {
            pcMasterId = projectConceptResponse.getId();

            String uuid = idGeneratorComponent.generateUUID();
            TappObjectiveCost tappObjectiveCost = new TappObjectiveCost();
            tappObjectiveCost.setCreatedBy("admin");
            tappObjectiveCost.setIsDeleted(false);
            tappObjectiveCost.setCreatedOn(LocalDate.now());
            BeanUtils.copyProperties(tappObjectiveCostDTO, tappObjectiveCost);
            tappObjectiveCost.setProjectConceptMasterId(pcMasterId);
            tappObjectiveCost.setUuid(uuid);
            tappObjectiveCost.setStatus(true);
            // Convert DTO to Objects ;

            // for make list for Currency List from DTO;
            List<TappCurrencyRate> currencyList = new ArrayList<>();
            List<DppCurrencyRateDTO> currencyRateDTOList = tappObjectiveCostDTO.getCurrencyRateList();
            for (DppCurrencyRateDTO dto : currencyRateDTOList) {
                TappCurrencyRate currencyRate = new TappCurrencyRate();

                BeanUtils.copyProperties(dto, currencyRate);

                String uui = idGeneratorComponent.generateUUID();
                currencyRate.setUuid(uui);
                currencyRate.setCreatedBy("admin");
                currencyRate.setIsDeleted(false);
                currencyRate.setCreatedOn(LocalDate.now());
                currencyList.add(currencyRate);
            }
            // has many Mode currencyRate set in master table: TappObjectiveCost ;
            tappObjectiveCost.setCurrencyRateList(currencyList);
            RevisedVersionDTO versionDTO = checkCurrentRtppVersion(projectConceptResponse.getUuid());
            tappObjectiveCost.setRevisedVersionNumber(versionDTO.getRevisedVersionNumber());
            TappObjectiveCost finalTappObjectiveCost = tappObjectiveCostRepository.save(tappObjectiveCost);


            /*------ TappDevelopmentPartners ------*/
            List<TappDevelopmentPartnersDTO> devPList = tappObjectiveCostDTO.getDevPartnerlist();
            for (TappDevelopmentPartnersDTO devDTO : devPList) {
                TappDevelopmentPartners tappDevelopmentPartners = new TappDevelopmentPartners();
                BeanUtils.copyProperties(devDTO, tappDevelopmentPartners);
                tappDevelopmentPartners.setUuid(idGeneratorComponent.generateUUID());
                tappDevelopmentPartners.setTappObjectiveCost(tappObjectiveCost); //Foreign key
                tappDevelopmentPartners.setCreatedBy("admin");
                tappDevelopmentPartners.setCreatedOn(LocalDate.now());
                tappDevelopmentPartners.setIsDeleted(false);
                tappDevelopmentPartnersRepository.save(tappDevelopmentPartners);
            }
            /*------ /TappDevelopmentPartners ------*/

            //Set mode of financing data
            TappModeOfFinancing modeOfFinancing = new TappModeOfFinancing();
            BeanUtils.copyProperties(tappObjectiveCostDTO, modeOfFinancing);
            modeOfFinancing.setTappObjectiveCost(tappObjectiveCost); //Foreign key
            modeOfFinancing.setCreatedBy("admin");
            modeOfFinancing.setIsDeleted(false);
            modeOfFinancing.setCreatedOn(LocalDate.now());
            String uuiMode = idGeneratorComponent.generateUUID();
            modeOfFinancing.setUuid(uuiMode);
            tappModeOnFinanceRepository.save(modeOfFinancing);




            /* * saving primary movement stage * */
            AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();

            ProjectMovementStage projectMovementStage = new ProjectMovementStage();
            projectMovementStage.setCurrentStage(MovementStageEnum.valueOf("AGENCY_DESK"));
            projectMovementStage.setRtappMasterId(tappObjectiveCost.getId());
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
            rdppRtappRevisedVersion.setRtppMasterId(tappObjectiveCost.getId());
            rdppRtappRevisedVersion.setVersion(versionDTO.getCurrentVersion());
            rdppRtappRevisedVersion.setPcUuid(projectConceptResponse.getUuid());
            rdppRTappRevisedVersionRepository.save(rdppRtappRevisedVersion);
            /* * saving Revision Version * */

            tappObjectiveCostDTO.setId(finalTappObjectiveCost.getId());
            tappObjectiveCostDTO.setUuid(finalTappObjectiveCost.getUuid());

            setPpsCode(projectConceptResponse, tappObjectiveCost);

            return new ResponseWithResults(1, "Data saved successfully", tappObjectiveCostDTO);
        } else {
            return new ResponseWithResults(0, "Project not fount", "");
        }
    }

    private void setPpsCode(ProjectConceptResponse pcInfo, TappObjectiveCost rtapp) {
        //YYYY-SectorId-MinistryDivisionId-AgencyId-ProjectTypeId-Id

        Agency agencyDTO = configurationClientService.getAgencyByNameEn(pcInfo.getImplementingAgencyName());
        String ministryAgencyCode = (agencyDTO==null)?"":String.valueOf(agencyDTO.getMinistryDivision().getId()+agencyDTO.getId());
        String ppsCode = rtapp.getCreatedOn().getYear() + pcInfo.getSectorId().toString() + ministryAgencyCode + pcInfo.getProjectTypeId().toString() + rtapp.getId().toString();

        rtapp.setPpsCode(ppsCode);
        tappObjectiveCostRepository.save(rtapp);
    }

    //Update Method For TappObjectiveCost;
    @Override
    public ResponseWithResults updateObjectiveCost(TappObjectiveCostDTO tappObjectiveCostDTO) {
        Long pcMasterId = 0L;
        ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptByUuid(tappObjectiveCostDTO.getProjectConceptUuid());
        if (projectConceptResponse.getId() < 1) {
            return new ResponseWithResults(0, "Project not fount", "");
        }

        pcMasterId = projectConceptResponse.getId();

        Optional<TappObjectiveCost> tappObj = tappObjectiveCostRepository.findByUuidAndIsDeleted(tappObjectiveCostDTO.getUuid(), false);
        if (tappObj.isPresent()) {
            TappObjectiveCost tappObjectiveCost = tappObj.get();

            BeanUtils.copyProperties(tappObjectiveCostDTO, tappObjectiveCost);
            tappObjectiveCost.setUpdatedBy("admin");
            tappObjectiveCost.setIsDeleted(false);
            tappObjectiveCost.setUpdatedOn(LocalDate.now());
            tappObjectiveCost.setProjectConceptMasterId(pcMasterId);
            tappObjectiveCost.setStatus(true);

            // for make list for Currency List from DTO;
            List<TappCurrencyRate> currencyList = new ArrayList<>();
            List<DppCurrencyRateDTO> currencyRateDTOList = tappObjectiveCostDTO.getCurrencyRateList();
            for (DppCurrencyRateDTO dto : currencyRateDTOList) {
                TappCurrencyRate currencyRate = new TappCurrencyRate();
                BeanUtils.copyProperties(dto, currencyRate);

                currencyRate.setUuid(idGeneratorComponent.generateUUID());
                currencyRate.setIsDeleted(false);
                currencyRate.setCreatedBy("admin");
                currencyRate.setCreatedOn(LocalDate.now());
                currencyList.add(currencyRate);
            }
            // has many Mode currencyRate set in master table: TappObjectiveCost ;
            tappObjectiveCost.setCurrencyRateList(currencyList);
            TappObjectiveCost finalTappObjectiveCost = tappObjectiveCostRepository.save(tappObjectiveCost);


            /*------ TappDevelopmentPartners ------*/
            List<TappDevelopmentPartnersDTO> devPList = tappObjectiveCostDTO.getDevPartnerlist();
            for (TappDevelopmentPartnersDTO devDTO : devPList) {
                if (!devDTO.getUuid().isEmpty()) {
                    Optional<TappDevelopmentPartners> tappDevelopmentPartnersOptional = tappDevelopmentPartnersRepository.findByUuidAndTappObjectiveCostIdAndIsDeleted(devDTO.getUuid(), tappObjectiveCost.getId(), false);
                    if (tappDevelopmentPartnersOptional.isPresent()) {
                        TappDevelopmentPartners tappDevelopmentPartners = tappDevelopmentPartnersOptional.get();
                        BeanUtils.copyProperties(devDTO, tappDevelopmentPartners);
                        tappDevelopmentPartners.setTappObjectiveCost(tappObjectiveCost); //Foreign key
                        tappDevelopmentPartners.setUpdatedBy("admin");
                        tappDevelopmentPartners.setUpdatedOn(LocalDate.now());
                        tappDevelopmentPartners.setIsDeleted(false);
                        tappDevelopmentPartnersRepository.save(tappDevelopmentPartners);
                    }
                } else {
                    TappDevelopmentPartners tappDevelopmentPartners = new TappDevelopmentPartners();
                    BeanUtils.copyProperties(devDTO, tappDevelopmentPartners);
                    tappDevelopmentPartners.setUuid(idGeneratorComponent.generateUUID());
                    tappDevelopmentPartners.setTappObjectiveCost(tappObjectiveCost); //Foreign key
                    tappDevelopmentPartners.setCreatedBy("admin");
                    tappDevelopmentPartners.setCreatedOn(LocalDate.now());
                    tappDevelopmentPartners.setIsDeleted(false);
                    tappDevelopmentPartnersRepository.save(tappDevelopmentPartners);
                }
            }
            /*------ /TappDevelopmentPartners ------*/


            //Set mode of financing data
            Optional<TappModeOfFinancing> mode = tappModeOnFinanceRepository.findByTappObjectiveCostIdAndIsDeleted(tappObjectiveCost.getId(), false);
            if (mode.isPresent()) {
                TappModeOfFinancing modeOfFinancing = mode.get();
                BeanUtils.copyProperties(tappObjectiveCostDTO, modeOfFinancing);
                modeOfFinancing.setTappObjectiveCost(tappObjectiveCost); //Foreign key
                modeOfFinancing.setUpdatedBy("admin");
                modeOfFinancing.setIsDeleted(false);
                modeOfFinancing.setUpdatedOn(LocalDate.now());
                tappModeOnFinanceRepository.save(modeOfFinancing);
            }
            tappObjectiveCostRepository.deleteTappCurrencyRates();

            tappObjectiveCostDTO.setId(finalTappObjectiveCost.getId());
            tappObjectiveCostDTO.setUuid(finalTappObjectiveCost.getUuid());

            return new ResponseWithResults(1, "Data updated successfully!", tappObjectiveCostDTO);
        } else {
            return new ResponseWithResults(0, "Project not fount ccc", "");
        }

    }


    @Transactional
    @Override
    public ResponseWithResults getByPcUuid(Long id) {
        Optional<TappObjectiveCost> tappObjectiveCost = tappObjectiveCostRepository.findByIdAndIsDeleted(id, false);
        if (tappObjectiveCost.isPresent()) {
            TappObjectiveCost objectiveCost = tappObjectiveCost.get();
            List<TappCurrencyRateDTO> currencyList = new ArrayList<>();

            TappObjectiveCostResponse response = new TappObjectiveCostResponse();
            BeanUtils.copyProperties(objectiveCost, response);

            response.setExpCommencementDate(objectiveCost.getDateCommencement());
            response.setExpCompletionDate(objectiveCost.getDateCompletion());

            List<TappCurrencyRate> curencyRate = objectiveCost.getCurrencyRateList();
            for (TappCurrencyRate mod : curencyRate) {
                TappCurrencyRateDTO devDto = new TappCurrencyRateDTO();
                BeanUtils.copyProperties(mod, devDto);
                currencyList.add(devDto);
            }
            response.setTappCurrencyRateDTOS(currencyList);

            List<TappDevelopmentPartnersDTO> devDTOList = new ArrayList<>();

            List<TappDevelopmentPartners> tappDevelopmentPartnersOptional = tappDevelopmentPartnersRepository.findAllByTappObjectiveCostIdAndIsDeleted(objectiveCost.getId(), false);

            if (!tappDevelopmentPartnersOptional.isEmpty()) {
                for (TappDevelopmentPartners devData : tappDevelopmentPartnersOptional) {
                    TappDevelopmentPartnersDTO tappDevelopmentPartnersDTO = new TappDevelopmentPartnersDTO();
                    BeanUtils.copyProperties(devData, tappDevelopmentPartnersDTO);
                    devDTOList.add(tappDevelopmentPartnersDTO);
                }
            }
            response.setDevelopmentPartnersList(devDTOList);

            Optional<TappModeOfFinancing> tappModeOfFinancing = tappModeOnFinanceRepository.findByTappObjectiveCostIdAndIsDeleted(objectiveCost.getId(), false);
            if (tappObjectiveCost.isPresent()) {
                TappModeOfFinancing modeOfFinancing = tappModeOfFinancing.get();
                TappModeFinancingDTO tappModeFinancingDTO = new TappModeFinancingDTO();
                BeanUtils.copyProperties(modeOfFinancing, tappModeFinancingDTO);
                response.setTappModeFinanceDTO(tappModeFinancingDTO);
            }

            List<DppObjectiveCostDates> dates = new ArrayList<>();
            List<TappObjectiveCost> objList = tappObjectiveCostRepository.findAllByProjectConceptMasterIdAndIsDeletedOrderById(objectiveCost.getProjectConceptMasterId(), false);
            for(TappObjectiveCost list : objList){
                DppObjectiveCostDates costDates = new DppObjectiveCostDates();
                costDates.setDateCommencement(list.getDateCommencement());
                costDates.setDateCompletion(list.getDateCompletion());
                costDates.setRevisedVersion(list.getRevisedVersion());
                costDates.setRdppMasterId(list.getId());
                if (objectiveCost.getId() != list.getId()){
                    dates.add(costDates);
                }
            }
            response.setObjCostDates(dates);

            return new ResponseWithResults(1, "Success", response);
        } else {
            return new ResponseWithResults(0, "Project not found", "");
        }
    }

    public ResponseEntity<ResponseStatus> deleteRow(String uuid) {

        Optional<TappDevelopmentPartners> data = tappDevelopmentPartnersRepository.findByUuid(uuid);
        if (data.isPresent()) {
            TappDevelopmentPartners tappDevelopmentPartners = data.get();
            tappDevelopmentPartners.setIsDeleted(true);
            tappDevelopmentPartners.setUpdatedOn(LocalDate.now());
            tappDevelopmentPartners.setUpdatedBy("admin");
            tappDevelopmentPartnersRepository.save(tappDevelopmentPartners);
            return new ResponseEntity(new ResponseStatus(1, "Data deleted successfully"), HttpStatus.OK);
        } else {
            return new ResponseEntity(new ResponseStatus(0, "Data deletion failed"), HttpStatus.OK);
        }
    }

    @Override
    public List<TappObjectiveCostDTO> getObjectiveCostList() {
        return tappObjectiveCostRepository.findAll().stream().map(tappObjectiveCost -> new TappObjectiveCostDTO() {{
            setProjectConceptMasterId(tappObjectiveCost.getProjectConceptMasterId());
            setProjectConceptUuid(tappObjectiveCost.getProjectConceptUuid());
            setProjectTitleEn(tappObjectiveCost.getProjectTitleEn());
            setProjectTitleBn(tappObjectiveCost.getProjectTitleBn());
            setDateCommencement(tappObjectiveCost.getDateCommencement());
            setDateCompletion(tappObjectiveCost.getDateCompletion());
            setId(tappObjectiveCost.getId());
            setUuid(tappObjectiveCost.getUuid());
        }}).collect(Collectors.toList());
    }

    @Override
    public TappObjectiveCostDTO getObjectiveCostByPcUuid(String pcUuid , Long id) {
        Optional<TappObjectiveCost> tappObjectiveCost = tappObjectiveCostRepository.findByProjectConceptUuidAndIdAndIsDeleted(pcUuid, id, false);
        return tappObjectiveCost.isPresent() ?
                tappObjectiveCost.map(objectiveCost -> new TappObjectiveCostDTO() {{
                    setId(objectiveCost.getId());
                    setProjectConceptMasterId(objectiveCost.getProjectConceptMasterId());
                    setProjectConceptUuid(objectiveCost.getProjectConceptUuid());
                    setProjectTitleEn(objectiveCost.getProjectTitleEn());
                    setProjectTitleBn(objectiveCost.getProjectTitleBn());
                    setDateCommencement(objectiveCost.getDateCommencement());
                    setDateCompletion(objectiveCost.getDateCompletion());
                    setTappMasterId(objectiveCost.getId());
                    setUuid(objectiveCost.getUuid());
                    setObjectivesTargets(objectiveCost.getObjectivesTargets());
                    setResponsiblePreparation(objectiveCost.getResponsiblePreparation());
                    setDesignationContactPerson(objectiveCost.getDesignationContactPerson());
                }}).orElse(null) : null;
    }

    public String checkCurrentRdppVersion(String pcUuid) {
        String version;
        List<RdppRtappRevisedVersion> rtappRevisedVersionList = rdppRTappRevisedVersionRepository.findAllByPcUuid(pcUuid);
        if(rtappRevisedVersionList.isEmpty()) {
            version = "1st Revised";
            return version;
        }
        int size = rtappRevisedVersionList.size();
        if(size == 1) {
            version = "2nd Revised";
        } else if(size == 2) {
            version = "3rd Revised";
        } else {
            size = size + 1;
            version = size + "th Revised";
        }
        return version;
    }

    public RevisedVersionDTO checkCurrentRtppVersion(String pcUuid) {
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


//    @Override
//    @Transactional
//    public Page<TappObjectiveCostDTO> getRtappList(PageableRequestBodyDTO requestBodyDTO) {
//        Pageable pageable = this.getPageable(requestBodyDTO);
//        Page<TappObjectiveCost> ePage = tappObjectiveCostRepository.findAllByStatusAndIsDeletedOrderByIdDesc(true, false, pageable);
//        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
//
//    }


    @Transactional
    @Override
    public Page<TappObjectiveCostDTO> getRtappList(PageableRequestBodyDTO requestBodyDTO) {

        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        UserGroupResponse userGroup = configurationClientService.getUserGroupByUserId(Long.parseLong(accessTokenDetail.getId()));

        Page<TappObjectiveCost> ePage = Page.empty();
        Pageable pageable = this.getPageable(requestBodyDTO);

        if (userGroup.getAgency() != null) {
            ePage = tappObjectiveCostRepository.findAllByImplementingAgencyInAndStatusAndIsDeletedOrderByIdDesc(Arrays.asList(userGroup.getAgency().getNameEn(),userGroup.getAgency().getNameBn()), true,false, pageable);

        } else if (userGroup.getMinistryDivision() != null) {
            ePage = tappObjectiveCostRepository.findAllByMinistryDivisionInAndStatusAndIsDeletedOrderByIdDesc(Arrays.asList(userGroup.getMinistryDivision().getNameEn(),userGroup.getMinistryDivision().getNameBn()), true,false, pageable);

        } else if (userGroup.getSectorDivision() != null) {
            ePage = tappObjectiveCostRepository.findAllByConcernedDivisionIdAndStatusAndIsDeletedOrderByIdDesc(userGroup.getSectorDivision().getId(), true,false, pageable);

        } else if (userGroup.getPlanningMinister() != null) {
            ePage = tappObjectiveCostRepository.getRdppObjectiveCosByCurrentStage(Arrays.asList(MovementStageEnum.APPROVED_BY_PLANNING_MINISTER.ordinal(), MovementStageEnum.PLANNING_MINISTER.ordinal()), pageable);

        } else if (userGroup.getEcnec() != null) {
            ePage = tappObjectiveCostRepository.getRdppObjectiveCosByCurrentStage(Arrays.asList(MovementStageEnum.APPROVED_BY_PLANNING_MINISTER.ordinal(),
                    MovementStageEnum.APPROVED_BY_ECNEC.ordinal(), MovementStageEnum.ECNEC.ordinal(), MovementStageEnum.ECNEC_DESK.ordinal(), MovementStageEnum.ECNEC_OFFICERS.ordinal(),
                    MovementStageEnum.ECNEC_CONDITIONAL_APPROVE.ordinal(), MovementStageEnum.UNAPPROVED_BY_ECNEC.ordinal()), pageable);
        }

        Page<TappObjectiveCostDTO> resultPage =  new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
        if(!resultPage.isEmpty()){
            for (TappObjectiveCostDTO tappObjectiveCostDTO : resultPage.getContent()) {
                List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByRtappMasterIdOrderByMovementTimeDesc(tappObjectiveCostDTO.getId());
                tappObjectiveCostDTO.setStatus(projectMovementStageList.get(0).getCurrentStage().name());

                ResponseEntity<List<GrandTotalResponseTapp>> grandTotal = annualPhasingCostServiceImpl.getGrandTotalByProjectConceptId(tappObjectiveCostDTO.getId());
                for (GrandTotalResponseTapp grandTotalResponse : grandTotal.getBody()) {
                    TappAnnualPhasingCostTotalDTO tappAnnualPhasingCostTotalDTO = new TappAnnualPhasingCostTotalDTO();
                    if (grandTotalResponse.getComponentName().toString().equals("Grand_Total")) {

                        TappAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
                        BeanUtils.copyProperties(annualCost, tappAnnualPhasingCostTotalDTO);
                        tappObjectiveCostDTO.setGrandTotal(tappAnnualPhasingCostTotalDTO);
                    }
                }
            }
        }

        return resultPage;
    }


    @Override
    public String checkCurrentVersion(Long id) {
        Optional<RdppRtappRevisedVersion> projectVersion = rdppRTappRevisedVersionRepository.findByRtppMasterId(id);
        if(projectVersion.isPresent()) {
            return projectVersion.get().getVersion();
        }
        return "Data Not Found";
    }

    @Override
    public Optional<TappObjectiveCost> findById(Long id) {
        return tappObjectiveCostRepository.findByIdAndIsDeleted(id, false);
    }

    @Override
    public Optional<TappObjectiveCost> findByReferenceId(Long referenceId){
        return tappObjectiveCostRepository.findByReferenceIdAndIsDeleted(referenceId, false);
    }

    @Override
    public Optional<TappObjectiveCost> findByReferenceIdAndAgencyId(Long referenceId, Long agencyId) {
        return tappObjectiveCostRepository.findByReferenceIdAndAgencyIdAndIsDeleted(referenceId, agencyId, false);
    }

    @Override
    public Optional<TappObjectiveCost> findByProjectConceptId(Long projectConceptId){
        List<TappObjectiveCost> tappObjectiveCostList = tappObjectiveCostRepository.findAllByProjectConceptMasterIdAndIsDeleted(projectConceptId, false);
        if ( CollectionUtils.isEmpty(tappObjectiveCostList) ){
            return Optional.empty();
        } else {
            return Optional.of(tappObjectiveCostList.get(0));
        }
    }

    @Override
    public TappObjectiveCostDTO getByReferenceUuid(String referenceUuid) {
        Optional<TappObjectiveCost> tappObjectiveCost = tappObjectiveCostRepository.findByReferenceUuidAndIsDeleted(referenceUuid, false);

        if (tappObjectiveCost.isPresent()){
            TappObjectiveCostDTO tappObjectiveCostDTO = new TappObjectiveCostDTO();
            BeanUtils.copyProperties(tappObjectiveCost.get(), tappObjectiveCostDTO);
            return tappObjectiveCostDTO;
        }
        return null;
    }

    @Override
    public TappObjectiveCostDTO getByRtappMasterId(Long rtappMasterId) {
        Optional<TappObjectiveCost> tappObjectiveCost = tappObjectiveCostRepository.findByIdAndIsDeleted(rtappMasterId, false);

        if (tappObjectiveCost.isPresent()){
            TappObjectiveCostDTO tappObjectiveCostDTO = new TappObjectiveCostDTO();
            BeanUtils.copyProperties(tappObjectiveCost.get(), tappObjectiveCostDTO);
            return tappObjectiveCostDTO;
        }
        return null;
    }

    @Override
    public String getCumulativeDate(Long id, String pcUuid) {
        Optional<TappObjectiveCost> tappObjectiveCostOptional = tappObjectiveCostRepository.findByProjectConceptUuidAndIdAndIsDeleted(pcUuid, id, false);
        LocalDate cumulativeLocalDate = null;
        String cumulativeDate;
        if (tappObjectiveCostOptional.isPresent()) {
            TappObjectiveCost tappObjectiveCost = tappObjectiveCostOptional.get();
            cumulativeLocalDate = tappObjectiveCost.getCumulativeDate();
        }
        cumulativeDate = String.valueOf(cumulativeLocalDate);
        return cumulativeDate;
    }

    @Override
    public ResponseWithResults getObjectiveCostByUuid(String uuid) {
        Optional<TappObjectiveCost> tappObjectiveCost = tappObjectiveCostRepository.findByUuidAndIsDeleted(uuid, false);
        if (tappObjectiveCost.isPresent()) {
            TappObjectiveCost objectiveCost = tappObjectiveCost.get();

            List<TappCurrencyRateDTO> currencyList = new ArrayList<>();

            TappObjectiveCostResponse response = new TappObjectiveCostResponse();
            BeanUtils.copyProperties(objectiveCost, response);

            response.setExpCommencementDate(objectiveCost.getDateCommencement());
            response.setExpCompletionDate(objectiveCost.getDateCompletion());

            List<TappCurrencyRate> curencyRate = objectiveCost.getCurrencyRateList();
            if(!CollectionUtils.isEmpty(curencyRate)){
                for (TappCurrencyRate mod : curencyRate) {
                    TappCurrencyRateDTO devDto = new TappCurrencyRateDTO();
                    BeanUtils.copyProperties(mod, devDto);
                    currencyList.add(devDto);
                }
            }

            response.setTappCurrencyRateDTOS(currencyList);

            List<TappDevelopmentPartnersDTO> devDTOList = new ArrayList<>();

            List<TappDevelopmentPartners> tappDevelopmentPartnersOptional = tappDevelopmentPartnersRepository.findAllByTappObjectiveCostIdAndIsDeleted(objectiveCost.getId(), false);

            if (!tappDevelopmentPartnersOptional.isEmpty()) {
                for (TappDevelopmentPartners devData : tappDevelopmentPartnersOptional) {
                    TappDevelopmentPartnersDTO tappDevelopmentPartnersDTO = new TappDevelopmentPartnersDTO();
                    BeanUtils.copyProperties(devData, tappDevelopmentPartnersDTO);
                    devDTOList.add(tappDevelopmentPartnersDTO);
                }
            }
            response.setDevelopmentPartnersList(devDTOList);

            Optional<TappModeOfFinancing> tappModeOfFinancing = tappModeOnFinanceRepository.findByTappObjectiveCostIdAndIsDeleted(objectiveCost.getId(), false);
            if (tappObjectiveCost.isPresent()) {
                TappModeOfFinancing modeOfFinancing = tappModeOfFinancing.get();
                TappModeFinancingDTO tappModeFinancingDTO = new TappModeFinancingDTO();
                BeanUtils.copyProperties(modeOfFinancing, tappModeFinancingDTO);
                response.setTappModeFinanceDTO(tappModeFinancingDTO);
            }

            return new ResponseWithResults(1, "Success", response);
        }
        return new ResponseWithResults(0, "Success", "");
    }

    @Override
    public List<DppAnnualPhasingCostTotalDTO> getEstimatedCost(String pcUuid) {
        List<TappObjectiveCost> objList = tappObjectiveCostRepository.findAllByProjectConceptUuidAndIsDeletedOrderByIdAsc(pcUuid, false);

        /** (Estimated Cost of the project calculation) */
        List<DppAnnualPhasingCostTotalDTO> estimatedCost = new ArrayList<>();
        /** Dpp Grand Total or original annual phasing cost  */
        ResponseEntity<List<GrandTotalResponseTapp>> dppGrandTotall = ppsDppTappClientService.getTappGrandTotalByProjectConceptId(objList.get(0).getProjectConceptMasterId());
        DppAnnualPhasingCostTotalDTO a = grandTotalCal(dppGrandTotall, "TAPP");
        a.setDateCommencement(objList.get(0).getDateCommencement());
        a.setDateCompletion(objList.get(0).getDateCompletion());
        a.setRevisedVersion("Original");
        estimatedCost.add(a);

        /** Annual Phasing cost Previous revised Data get here */
        for (int i = 0; i < objList.size(); i++) {
            TappObjectiveCost val = objList.get(i);
            if (!val.getRevisedVersion().equals("1st Revised")) {
                ResponseEntity<List<GrandTotalResponseTapp>> grandTotal2 = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(val.getReferenceId());
                DppAnnualPhasingCostTotalDTO dppDto = grandTotalCal(grandTotal2, "RTAPP");
                TappObjectiveCost preVal = objList.get(i - 1);
                dppDto.setDateCommencement(preVal.getDateCommencement());
                dppDto.setDateCompletion(preVal.getDateCompletion());
                dppDto.setRevisedVersion(preVal.getRevisedVersion());
                estimatedCost.add(dppDto);
            }
        }

        /** Annual Phasing cost proposed Data set here */
        TappObjectiveCost lastIndex = objList.get(objList.size() - 1);
        ResponseEntity<List<GrandTotalResponseTapp>> grandTotal3 = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(lastIndex.getId());
        DppAnnualPhasingCostTotalDTO dDto = grandTotalCal(grandTotal3, "RTAPP");
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

    private DppAnnualPhasingCostTotalDTO grandTotalCal(ResponseEntity<List<GrandTotalResponseTapp>> grandTotal, String type) {
        DppAnnualPhasingCostTotalDTO annualCost = new DppAnnualPhasingCostTotalDTO();
        for (GrandTotalResponseTapp grandTotalResponse : grandTotal.getBody()) {
            if (grandTotalResponse.getComponentName().toString().equals("Grand_Total")) {
                TappAnnualPhasingCostTotalDTO annualCostCopy = null;
                if (type.equals("TAPP")) {
                    annualCostCopy = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
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

    @Override
    public TappObjectiveCostDTO updateMainFeaturesRevision(MainFeaturesRevisionDTO request) {
        Optional<TappObjectiveCost> objectiveCost = tappObjectiveCostRepository.findByIdAndIsDeleted(request.getRtappMasterId(), false);
        if (objectiveCost.isPresent()){
            objectiveCost.get().setMainFeaturesOfRevision(request.getMainFeaturesRevision());

            TappObjectiveCostDTO tappObjectiveCostDTO = new TappObjectiveCostDTO();
            BeanUtils.copyProperties(objectiveCost.get(), tappObjectiveCostDTO);

            return update(tappObjectiveCostDTO);
        }
        return null;
    }

    public ResponseStatusDTO ecnecRtappApprovalProjectAcknowledgement(ProjectListDTO projectDTO) {
        ResponseStatusDTO response = new ResponseStatusDTO("success", "Successfully project acknowledged with ECNEC");
        TappObjectiveCost rtappInfo = tappObjectiveCostRepository.findByPpsCodeAndIsDeleted(projectDTO.getPpsCode(), false);
        if (rtappInfo != null) {
            if (rtappInfo.getIsEcnecAcknowledgement() == null || !rtappInfo.getIsEcnecAcknowledgement()) {
                rtappInfo.setIsEcnecAcknowledgement(true);
                rtappInfo.setEcnecId(projectDTO.getEcnecId());
                tappObjectiveCostRepository.save(rtappInfo);
            } else if (rtappInfo.getIsEcnecAcknowledgement()) {
                response.setStatus("fail");
                response.setMessage("Project already acknowledged with ECNEC");
            }
        } else {
            response.setStatus("fail");
            response.setMessage("Project not found");
        }

        return response;
    }
}
