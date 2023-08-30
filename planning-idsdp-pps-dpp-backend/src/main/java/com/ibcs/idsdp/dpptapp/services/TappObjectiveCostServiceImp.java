package com.ibcs.idsdp.dpptapp.services;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.repositories.ProjectMovementRepository;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.model.domain.*;
import com.ibcs.idsdp.dpptapp.model.repositories.TappDevelopmentPartnersRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappModeOnFinanceRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.web.dto.*;
import com.ibcs.idsdp.dpptapp.web.dto.dashboardDTO.DashboardPcDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectConceptShortInfoDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.TappObjectiveCostResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TappObjectiveCostServiceImp extends BaseService<TappObjectiveCost, TappObjectiveCostDTO> implements TappObjectiveCostService {

    private final TappObjectiveCostRepository tappObjectiveCostRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private ProjectConceptClientService projectConceptClientService;
    private TappModeOnFinanceRepository tappModeOnFinanceRepository;
    private TappDevelopmentPartnersRepository tappDevelopmentPartnersRepository;
    private ProjectMovementRepository projectMovementRepository;

    public TappObjectiveCostServiceImp(TappObjectiveCostRepository tappObjectiveCostRepository, IdGeneratorComponent idGeneratorComponent,
                                       ProjectConceptClientService projectConceptClientService, TappModeOnFinanceRepository tappModeOnFinanceRepository,
                                       TappDevelopmentPartnersRepository tappDevelopmentPartnersRepository,
                                       ProjectMovementRepository projectMovementRepository) {
        super(tappObjectiveCostRepository);
        this.tappObjectiveCostRepository = tappObjectiveCostRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.projectConceptClientService = projectConceptClientService;
        this.tappModeOnFinanceRepository = tappModeOnFinanceRepository;
        this.tappDevelopmentPartnersRepository = tappDevelopmentPartnersRepository;
        this.projectMovementRepository = projectMovementRepository;
    }

    //Save Method For TappObjectiveCost;
    @Override
    public ResponseWithResults createObjectiveCost(TappObjectiveCostDTO tappObjectiveCostDTO) {
        Long pcMasterId = 0L;
        ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptMasterId(tappObjectiveCostDTO.getProjectConceptUuid());
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
            tappObjectiveCost.setCurrencyRateList(currencyList);

            if (tappObjectiveCostDTO.getModeFinanceList().size() > 0) {
                List<TppModeOfFinancing> modeOfFinancingHashSet = new ArrayList<>();
                List<DppModeFinancingDTO> modeFinancingDTOList = tappObjectiveCostDTO.getModeFinanceList();
                for (DppModeFinancingDTO dto : modeFinancingDTOList) {
                    TppModeOfFinancing modeOfFinancing = new TppModeOfFinancing();
                    BeanUtils.copyProperties(dto, modeOfFinancing);
                    String uuiMode = idGeneratorComponent.generateUUID();
                    modeOfFinancing.setCreatedBy("admin");
                    modeOfFinancing.setIsDeleted(false);
                    modeOfFinancing.setCreatedOn(LocalDate.now());
                    modeOfFinancing.setUuid(uuiMode);
                    modeOfFinancingHashSet.add(modeOfFinancing);
                }
                tappObjectiveCost.setModeFinanceList(modeOfFinancingHashSet);
            }

            TappObjectiveCost finalTappObjectiveCost = tappObjectiveCostRepository.save(tappObjectiveCost);
            updateProjectConceptShortInfo(tappObjectiveCostDTO);

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
            projectMovementStage.setTappMasterId(tappObjectiveCost.getId());
            projectMovementStage.setIsDeleted(false);
            LocalDateTime localDateTime = LocalDateTime.now();
            projectMovementStage.setCreatedOn(localDateTime.toLocalDate());
            projectMovementStage.setMovementTime(localDateTime);
            projectMovementStage.setUuid(idGeneratorComponent.generateUUID());
            projectMovementStage.setUserId(Long.parseLong(accessTokenDetail.getId()));
            projectMovementRepository.save(projectMovementStage);
            /* * saving primary movement stage * */

            tappObjectiveCostDTO.setId(finalTappObjectiveCost.getId());
            tappObjectiveCostDTO.setUuid(finalTappObjectiveCost.getUuid());

            return new ResponseWithResults(1, "Data saved successfully", tappObjectiveCostDTO);
        } else {
            return new ResponseWithResults(0, "Project not fount", "");
        }
    }


    //Update Method For TappObjectiveCost;
    @Override
    public ResponseWithResults updateObjectiveCost(TappObjectiveCostDTO tappObjectiveCostDTO) {
        Long pcMasterId = 0L;
        ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptMasterId(tappObjectiveCostDTO.getProjectConceptUuid());
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
            tappObjectiveCost.setCurrencyRateList(currencyList);

//            tappObjectiveCost.getModeFinanceList().clear();
            if (tappObjectiveCostDTO.getModeFinanceList().size() > 0) {
                List<TppModeOfFinancing> modeOfFinancingHashSet = new ArrayList<>();
                List<DppModeFinancingDTO> modeFinancingDTOList = tappObjectiveCostDTO.getModeFinanceList();
                for (DppModeFinancingDTO dto : modeFinancingDTOList) {
                    TppModeOfFinancing modeOfFinancing = new TppModeOfFinancing();
                    BeanUtils.copyProperties(dto, modeOfFinancing);
                    String uuiMode = idGeneratorComponent.generateUUID();
                    modeOfFinancing.setCreatedBy("admin");
                    modeOfFinancing.setIsDeleted(false);
                    modeOfFinancing.setCreatedOn(LocalDate.now());
                    modeOfFinancing.setUuid(uuiMode);
                    modeOfFinancingHashSet.add(modeOfFinancing);
                }
                tappObjectiveCost.setModeFinanceList(modeOfFinancingHashSet);
            }

            TappObjectiveCost finalTappObjectiveCost = tappObjectiveCostRepository.save(tappObjectiveCost);
            updateProjectConceptShortInfo(tappObjectiveCostDTO);

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
    public ResponseWithResults getByPcUuid(String pcUuid) {

        Optional<TappObjectiveCost> tappObjectiveCost = tappObjectiveCostRepository.findByProjectConceptUuidAndIsDeleted(pcUuid.trim(), false);
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

            List<DppModeFinancingDTO> financeList = new ArrayList<>();
            List<TppModeOfFinancing> modeOfFinancings = objectiveCost.getModeFinanceList();
            for (TppModeOfFinancing mod : modeOfFinancings) {
                DppModeFinancingDTO modeFinancingDTO = new DppModeFinancingDTO();
                BeanUtils.copyProperties(mod, modeFinancingDTO);
                financeList.add(modeFinancingDTO);
            }
            response.setModeFinanceList(financeList);

            return new ResponseWithResults(1, "Success", response);
        } else {
            ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptMasterId(pcUuid);
            if (projectConceptResponse.getId() > 0) {
                DashboardPcDTO proj = new DashboardPcDTO();
                BeanUtils.copyProperties(projectConceptResponse, proj);
                return new ResponseWithResults(2, "Project concept data", proj);
            } else {
                return new ResponseWithResults(0, "Project not fount", "");
            }
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
    public TappObjectiveCostDTO getObjectiveCostByPcUuid(String pcUuid) {
        Optional<TappObjectiveCost> tappObjectiveCost = tappObjectiveCostRepository.findByProjectConceptUuidAndIsDeleted(pcUuid, false);
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
                    setImplementingAgency(objectiveCost.getImplementingAgency());
                    setMinistryDivision(objectiveCost.getMinistryDivision());
                }}).orElse(null) : null;
    }

    @Override
    public TappObjectiveCostDTO getShortInfoByPcUuid(String pcUuid) {
        TappObjectiveCost tapp = tappObjectiveCostRepository.findByProjectConceptUuid(pcUuid);
        return tapp==null?null:convertForRead(tapp);
    }

    @Override
    public TappObjectiveCostDTO getTappObjectiveCostByPpsCode(String ppsCode) {
        Optional<TappObjectiveCost> tappInfo = tappObjectiveCostRepository.findByPpsCodeAndIsDeleted(ppsCode, false);

        if (tappInfo.isPresent()) {
            TappObjectiveCostDTO tappInfoDTO = convertForRead(tappInfo.get());
            tappInfoDTO.setTappMasterId(tappInfo.get().getId());
            return tappInfoDTO;
        }
        return null;
    }

    private void updateProjectConceptShortInfo(TappObjectiveCostDTO tappObjectiveCostDTO) {
        ProjectConceptShortInfoDTO request = new ProjectConceptShortInfoDTO();
        request.setPcUuid(tappObjectiveCostDTO.getProjectConceptUuid());
        request.setTitleEn(tappObjectiveCostDTO.getProjectTitleEn());
        request.setTitleBn(tappObjectiveCostDTO.getProjectTitleBn());
        request.setCommencementDate(tappObjectiveCostDTO.getDateCommencement());
        request.setCompletionDate(tappObjectiveCostDTO.getDateCompletion());
        request.setSectorDivisionId(tappObjectiveCostDTO.getConcernedDivisionId());
        request.setSectorId(tappObjectiveCostDTO.getSectorId());
        request.setSubSectorId(tappObjectiveCostDTO.getSubSectorId());
        projectConceptClientService.updateProjectShortInfo(request);
    }
}
