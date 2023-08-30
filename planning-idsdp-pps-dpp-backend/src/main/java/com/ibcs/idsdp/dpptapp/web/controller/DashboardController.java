package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.constants.DppAnnualPhasingCostConstant;
import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.domain.TappObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.services.DashboardService;
import com.ibcs.idsdp.dpptapp.web.dto.dashboardDTO.AnnexureAmountDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dashboardDTO.DashboardPcDTO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManagerFactory;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@AllArgsConstructor
@RestApiController
@RequestMapping("dpp-dashboard/")
public class DashboardController {

    private EntityManagerFactory entityManagerFactory;
    private ProjectConceptClientService projectConceptClientService;
    private DppObjectiveCostRepository dppObjectiveCostRepository;
    private TappObjectiveCostRepository tappObjectiveCostRepository;
    private final DashboardService dashboardService;

    @Transactional
    @GetMapping(path = "get-data" + "/{projectConceptUuid}/{projectConceptId}/{projectTypeId}", produces = "application/json")
    public ResponseWithResults getDppTappDashboardData(@PathVariable String projectConceptUuid, @PathVariable Long projectConceptId, @PathVariable Long projectTypeId) {
        String message = "";

        DashboardPcDTO dashboardPcDTO = new DashboardPcDTO();
        String repo = "";
        if (projectTypeId == 1) {
            message = "Success! DPP project";
            Optional<DppObjectiveCost> dppObjectiveCost = dppObjectiveCostRepository.findByProjectConceptMasterIdAndProjectConceptUuidAndIsDeleted(projectConceptId, projectConceptUuid, false);
            if (dppObjectiveCost.isPresent()) {
                DppObjectiveCost obj = dppObjectiveCost.get();
                dashboardPcDTO.setId(obj.getId());
                dashboardPcDTO.setProjectTitleEn(obj.getProjectTitleEn());
                dashboardPcDTO.setProjectTitleBn(obj.getProjectTitleBn());
                dashboardPcDTO.setDateCommencement(obj.getDateCommencement());
                dashboardPcDTO.setDateCompletion(obj.getDateCompletion());
            }
        } else {
            message = "Success! TAPP project";
            Optional<TappObjectiveCost> dppObjectiveCost = tappObjectiveCostRepository.findByProjectConceptMasterIdAndProjectConceptUuidAndIsDeleted(projectConceptId, projectConceptUuid, false);
            if (dppObjectiveCost.isPresent()) {
                TappObjectiveCost obj = dppObjectiveCost.get();
                dashboardPcDTO.setId(obj.getId());
                dashboardPcDTO.setProjectTitleEn(obj.getProjectTitleEn());
                dashboardPcDTO.setProjectTitleBn(obj.getProjectTitleBn());
                dashboardPcDTO.setDateCommencement(obj.getDateCommencement());
                dashboardPcDTO.setDateCompletion(obj.getDateCompletion());
            }
        }

        ProjectConceptResponse proConcept = projectConceptClientService.getProjectConceptMasterId(projectConceptUuid);
        if (proConcept.getId() > 0) {
            dashboardPcDTO.setPcId(proConcept.getId());
            dashboardPcDTO.setTitleEn(proConcept.getTitleEn());
            dashboardPcDTO.setTitleBn(proConcept.getTitleBn());
            dashboardPcDTO.setProjectTypeId(proConcept.getProjectTypeId());
            dashboardPcDTO.setGobAmount(proConcept.getGobAmount());
            dashboardPcDTO.setPaAmount(proConcept.getPaAmount());
            dashboardPcDTO.setOwnFundAmount(proConcept.getOwnFundAmount());
            dashboardPcDTO.setOtherAmount(proConcept.getOtherAmount());
            dashboardPcDTO.setExpCommencementDate(proConcept.getExpCommencementDate());
            dashboardPcDTO.setExpCompletionDate(proConcept.getExpCompletionDate());
            return new ResponseWithResults(1, message, dashboardPcDTO);
        } else {
            return new ResponseWithResults(0, "Failed! Project not found", dashboardPcDTO);
        }

    }

    @GetMapping("part-b-attachment/{id}")
    public Page<Attachment> getPartBAllAttachment(@PathVariable Long id, @RequestParam(name = "page", defaultValue = "0") int page,
                                                  @RequestParam(name = "size", defaultValue = "10") int size) {
        return dashboardService.getPartBAllAttachment(page, size, id);
    }


    @GetMapping("part-b-attachment-without-pageable/{id}")
    public List<Attachment> getPartBAllAttachment(@PathVariable Long id) {
        return dashboardService.getPartBAllAttachment(id);
    }


    @GetMapping("getGrandTotalByProjectConceptIdList/{agencyId}")
    public ResponseEntity<Double> getGrandTotalByProjectConceptIdList(@PathVariable Long agencyId) {
        return dashboardService.getGrandTotalByProjectConceptIdList(agencyId);
    }

    @PostMapping("getGrandTotalByPcIds")
    public Map<Long, AnnexureAmountDTO> getGrandTotalByPcIds(@RequestBody Set<Long> pcIds) {
        return dashboardService.getGrandTotalByPcIds(pcIds);
    }

}
