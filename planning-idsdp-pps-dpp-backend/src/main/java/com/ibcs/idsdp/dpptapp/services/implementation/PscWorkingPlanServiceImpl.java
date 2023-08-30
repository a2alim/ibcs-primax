package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.enums.TappAnnualPhasing;
import com.ibcs.idsdp.dpptapp.model.domain.PscWorkingPlan;
import com.ibcs.idsdp.dpptapp.model.domain.TappObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.repositories.PscWorkingPlanRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.services.DppAnnualPhasingCostService;
import com.ibcs.idsdp.dpptapp.services.DppObjectiveCostService;
import com.ibcs.idsdp.dpptapp.services.IPscWorkingPlanService;
import com.ibcs.idsdp.dpptapp.services.TappAnnualPhasingCostService;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.dpptapp.web.dto.PscWorkingPlanDTO;
import com.ibcs.idsdp.dpptapp.web.dto.TappAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.DppObjectiveCostResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.GrandTotalResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.GrandTotalResponseTapp;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PscWorkingPlanServiceImpl extends BaseService<PscWorkingPlan, PscWorkingPlanDTO> implements IPscWorkingPlanService {

    private final PscWorkingPlanRepository pscWorkingPlanRepository;
    private final ProjectConceptClientService projectConceptClientService;
    private final DppObjectiveCostService dppObjectiveCostService;
    private final TappObjectiveCostRepository tappObjectiveCostRepository;
    private final DppAnnualPhasingCostService dppAnnualPhasingCostService;
    private final TappAnnualPhasingCostService tappAnnualPhasingCostService;

    PscWorkingPlanServiceImpl(PscWorkingPlanRepository pscWorkingPlanRepository, ProjectConceptClientService projectConceptClientService,
                              DppObjectiveCostService dppObjectiveCostService, DppAnnualPhasingCostService dppAnnualPhasingCostService,
                              TappAnnualPhasingCostService tappAnnualPhasingCostService, TappObjectiveCostRepository tappObjectiveCostRepository) {
        super(pscWorkingPlanRepository);
        this.pscWorkingPlanRepository = pscWorkingPlanRepository;
        this.projectConceptClientService = projectConceptClientService;
        this.dppObjectiveCostService = dppObjectiveCostService;
        this.tappObjectiveCostRepository = tappObjectiveCostRepository;
        this.dppAnnualPhasingCostService = dppAnnualPhasingCostService;
        this.tappAnnualPhasingCostService = tappAnnualPhasingCostService;
    }

    @Override
    public PscWorkingPlanDTO getPscWorkingPlanByPcId(String pcUuid, String pscPaperType, String userType) {
        Optional<PscWorkingPlan> pscWorkingPlan = pscWorkingPlanRepository.findByProjectConceptUuidAndPscPaperTypeAndUserType(pcUuid, pscPaperType, userType);
        PscWorkingPlanDTO pscWorkingPlanDTO = pscWorkingPlan.map(this::convertForRead).orElse(null);
        return pscWorkingPlanDTO;
    }

    @Override
    public PscWorkingPlanDTO getPscWorkingPlanWithObjectiveAndCostByPcUuid(String uuid, String pscPaperType, String userType) {
        PscWorkingPlanDTO pscWorkingPlanDTO = new PscWorkingPlanDTO();
        Optional<PscWorkingPlan> pscWorkingPlan = pscWorkingPlanRepository.findByProjectConceptUuidAndPscPaperTypeAndUserType(uuid, pscPaperType, userType);
        if(pscWorkingPlan.isPresent()){
            pscWorkingPlanDTO = super.convertForRead(pscWorkingPlan.get());
            ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptMasterId(uuid);
            if(projectConceptResponse!=null) {
                pscWorkingPlanDTO.setTotalAmount(projectConceptResponse.getTotalAmount());
                pscWorkingPlanDTO.setProjectTitleBn(projectConceptResponse.getTitleBn());
                pscWorkingPlanDTO.setGobAmount(projectConceptResponse.getGobAmount());
                pscWorkingPlanDTO.setPaAmount(projectConceptResponse.getPaAmount());
                pscWorkingPlanDTO.setOwnFundAmount(projectConceptResponse.getOwnFundAmount());
                pscWorkingPlanDTO.setOtherAmount(projectConceptResponse.getOtherAmount());
                if (projectConceptResponse.getProjectTypeDTO().getNameEn().equalsIgnoreCase("dpp")) {
                    DppObjectiveCostResponse dppObjectiveCostResponse = (DppObjectiveCostResponse) dppObjectiveCostService.getObjectivesAndCost(uuid).getRes();
                    pscWorkingPlanDTO.setModeFinanceList(dppObjectiveCostResponse.getModeFinanceList());
                    pscWorkingPlanDTO.setImplementingAgency(dppObjectiveCostResponse.getImplementingAgency());
                    pscWorkingPlanDTO.setMinistryDivision(dppObjectiveCostResponse.getMinistryDivision());
                    pscWorkingPlanDTO.setDuration(dppObjectiveCostResponse.getDateCommencement()+" - "+dppObjectiveCostResponse.getDateCompletion());
                    List<GrandTotalResponse> dppGrandTotalResponses = dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(projectConceptResponse.getId()).getBody();
                    System.out.println(dppGrandTotalResponses);
                    if (!dppGrandTotalResponses.isEmpty() && dppGrandTotalResponses.size() > 1) {
                        List<DppAnnualPhasingCostTotalDTO> totalDTO = dppGrandTotalResponses.stream().filter(f -> f.getDppAnnualPhasing().equals(DppAnnualPhasing.Grand_Total)).map(m -> m.getDppAnnualPhasingCostTotal().get(0)).collect(Collectors.toList());
                        pscWorkingPlanDTO.setTotalAmount(totalDTO.get(0).getTotalAmount());
                        pscWorkingPlanDTO.setGobAmount(totalDTO.get(0).getGobAmount());
                        pscWorkingPlanDTO.setPaAmount(totalDTO.get(0).getGobThruAmount() + totalDTO.get(0).getSpAcAmount() + totalDTO.get(0).getThruDpAmount() + totalDTO.get(0).getThruPdAmount());
                        pscWorkingPlanDTO.setOwnFundAmount(totalDTO.get(0).getOwnFundAmount());
                        pscWorkingPlanDTO.setOtherAmount(totalDTO.get(0).getOtherAmount());
                    }
                } else if (projectConceptResponse.getProjectTypeDTO().getNameEn().equalsIgnoreCase("tapp")) {
                    Optional<TappObjectiveCost> tappObjectiveCost = tappObjectiveCostRepository.findByProjectConceptUuidAndIsDeleted(uuid, false);
                    if(tappObjectiveCost.isPresent()){
                        pscWorkingPlanDTO.setMinistryDivision(tappObjectiveCost.get().getMinistryDivision());
                        pscWorkingPlanDTO.setImplementingAgency(tappObjectiveCost.get().getImplementingAgency());
                    }
                    List<GrandTotalResponseTapp> tappGrandTotalResponses = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(projectConceptResponse.getId()).getBody();
                    if (!tappGrandTotalResponses.isEmpty() && tappGrandTotalResponses.size() > 1) {
                        List<TappAnnualPhasingCostTotalDTO> totalDTO = tappGrandTotalResponses.stream().filter(f -> f.getComponentName().equals(DppAnnualPhasing.Grand_Total)).map(m -> m.getTappAnnualPhasingCostTotal().get(0)).collect(Collectors.toList());
                        pscWorkingPlanDTO.setTotalAmount(totalDTO.get(0).getTotalAmount());
                        pscWorkingPlanDTO.setGobAmount(totalDTO.get(0).getGobAmount());
                        pscWorkingPlanDTO.setPaAmount(totalDTO.get(0).getGobThruAmount() + totalDTO.get(0).getSpAcAmount() + totalDTO.get(0).getThruDpAmount() + totalDTO.get(0).getThruPdAmount());
                        pscWorkingPlanDTO.setOwnFundAmount(totalDTO.get(0).getOwnFundAmount());
                        pscWorkingPlanDTO.setOtherAmount(totalDTO.get(0).getOtherAmount());
                    }
                }
            }
        }
        return pscWorkingPlanDTO;
    }
}
