package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappObjectiveCost;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.rdpprtapp.services.DashboardService;
import com.ibcs.idsdp.rdpprtapp.web.dto.dashboardDTO.DashboardPcDTO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManagerFactory;
import java.util.List;
import java.util.Optional;

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

        ProjectConceptResponse proConcept = projectConceptClientService.getProjectConceptByUuid(projectConceptUuid);
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


    @GetMapping("getGrandTotalByProjectConceptIdList")
    public ResponseEntity<Double> getGrandTotalByProjectConceptIdList() {
        return dashboardService.getGrandTotalByProjectConceptIdList();
    }

}
