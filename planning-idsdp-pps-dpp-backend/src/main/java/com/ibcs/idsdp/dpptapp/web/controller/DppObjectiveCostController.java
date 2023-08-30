package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.DppObjectiveCostConstant;
import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.services.DppObjectiveCostService;
import com.ibcs.idsdp.dpptapp.services.DripApiService;
import com.ibcs.idsdp.dpptapp.web.dto.AgencyDashboardDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppObjectiveCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.FsLinkWithDto;
import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.IndicatorDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.IndicatorUrlListDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.IndicatorUrlRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestApiController
@RequestMapping(DppObjectiveCostConstant.OBJECTIVE_COST)
public class DppObjectiveCostController extends BaseController<DppObjectiveCost, DppObjectiveCostDTO> {

    private final DppObjectiveCostService dppObjectiveCostService;
    private final DripApiService dripApiService;

    public DppObjectiveCostController(BaseService<DppObjectiveCost, DppObjectiveCostDTO> baseService, DppObjectiveCostService dppObjectiveCostService, DripApiService dripApiService) {
        super(baseService);
        this.dppObjectiveCostService = dppObjectiveCostService;
        this.dripApiService = dripApiService;
    }


    /**
     * For create DppObjectiveCost
     *
     * @param dppObjectiveCostDTO
     * @return
     */
    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public DppObjectiveCostDTO create(@RequestBody DppObjectiveCostDTO dppObjectiveCostDTO) {
        //System.out.println(dppObjectiveCostDTO);
        return dppObjectiveCostService.createObjectiveCost(dppObjectiveCostDTO);
    }

    /**
     * For update DppObjectiveCost
     *
     * @param dppObjectiveCostDTO
     * @return
     */
    @PostMapping(path = BaseConstant.UPDATE, produces = "application/json")
    public DppObjectiveCostDTO update(@RequestBody DppObjectiveCostDTO dppObjectiveCostDTO) {
        return dppObjectiveCostService.updateObjectiveCost(dppObjectiveCostDTO);
    }

    /**
     * Get By Pcuuid
     *
     * @param pcUuid
     * @return
     */
    @GetMapping("/getByPcuuid/{pcUuid}")
    public ResponseWithResults getByPcuuid(@PathVariable String pcUuid) {
        return dppObjectiveCostService.getObjectivesAndCost(pcUuid);
    }

    @DeleteMapping("/delete-dev-partner/{rowUuid}")
    public ResponseEntity<ResponseStatus> deleteDevPartnerRow(@PathVariable String rowUuid) {
        return dppObjectiveCostService.deleteDevPartnerRow(rowUuid);
    }

    // all dpp objective and cost master data
    @GetMapping(path = "get-dpp-master-data", produces = "application/json")
    public List<DppObjectiveCostDTO> getObjectiveCostList() {
        return dppObjectiveCostService.getObjectiveCostList();
    }

    // dpp objective and cost master data by project concept uuid
    @GetMapping(path = "get-dpp-master-data/{pcUuid}", produces = "application/json")
    public DppObjectiveCostDTO getObjectiveCostByPcUuid(@PathVariable String pcUuid) {
        return dppObjectiveCostService.getObjectiveCostByPcUuid(pcUuid);
    }

    @PostMapping(path = "get-all-stages-by-pc-ids", produces = "application/json")
    public AgencyDashboardDTO getAllStagesByPcIds(@RequestBody AgencyDashboardDTO ids) {
        return dppObjectiveCostService.getAllStagesByPcIds(ids.getIds());
    }

    @PostMapping(path = DppObjectiveCostConstant.LINK_FS_WITH_DPP, produces = "application/json")
    public ResponseStatus linkFsReportWithDpp(@RequestBody FsLinkWithDto fsLinkWithDto) {
        return dppObjectiveCostService.linkFsReportWithDpp(fsLinkWithDto);
    }

}
