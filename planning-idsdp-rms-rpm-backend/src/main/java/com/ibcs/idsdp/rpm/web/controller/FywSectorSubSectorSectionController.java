package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.model.domain.FywSectorSubSectorSection;
import com.ibcs.idsdp.rpm.model.repositories.FywSectorSubSectorSectionRepository;
import com.ibcs.idsdp.rpm.services.FywSectorSubSectorSectionService;
import com.ibcs.idsdp.rpm.web.dto.request.FywSectorSubSectorSectionRequest;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.FiscalYearResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.SectorTypeResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.SubSectorResponse;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.FywSectorSubSectorSectionResponse;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.GetActiveDataResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

@RestApiController
@RequestMapping("api/fyw-sector-sub-sector-selection/")
public class FywSectorSubSectorSectionController extends BaseController<FywSectorSubSectorSection, FywSectorSubSectorSectionRequest, FywSectorSubSectorSectionResponse> {

    public final FywSectorSubSectorSectionService fywSectorSubSectorSectionService;
    public final RmsConfigurationClientService rmsConfigurationClientService;
    private EntityManagerFactory entityManagerFactory;
    private EntityManager entityManager;
    private FywSectorSubSectorSectionRepository fywSectorSubSectorSectionRepository;

    public FywSectorSubSectorSectionController(BaseService<FywSectorSubSectorSection, FywSectorSubSectorSectionRequest, FywSectorSubSectorSectionResponse> service, FywSectorSubSectorSectionService fywSectorSubSectorSectionService, RmsConfigurationClientService rmsConfigurationClientService) {
        super(service);
        this.fywSectorSubSectorSectionService = fywSectorSubSectorSectionService;
        this.rmsConfigurationClientService = rmsConfigurationClientService;
    }

    @PostMapping(path = "add", produces = "application/json")
    public Response<FywSectorSubSectorSectionResponse> dataSave(@RequestBody FywSectorSubSectorSectionRequest fywSectorSubSectorSectionRequest) {
        System.out.println("fywSectorSubSectorSectionRequest = " + fywSectorSubSectorSectionRequest);
        return fywSectorSubSectorSectionService.dataSave(fywSectorSubSectorSectionRequest);
    }

    @PutMapping(path = "edit", produces = "application/json")
    public Response<FywSectorSubSectorSectionResponse> dataUpdate(@RequestBody FywSectorSubSectorSectionRequest fywSectorSubSectorSectionRequest) {
        return fywSectorSubSectorSectionService.dataUpdate(fywSectorSubSectorSectionRequest);
    }

    @GetMapping(path = "get-active-fiscal-years", produces = "application/json")
    public GetActiveDataResponse findAllByActiveData() {
      GetActiveDataResponse activeData = new GetActiveDataResponse();

        Response<FiscalYearResponse> activeFiscalYears = rmsConfigurationClientService.getActiveFiscalYears();
        activeData.setFiscalYear(activeFiscalYears.getItems());

        Response<SectorTypeResponse> activeSectorTypes = rmsConfigurationClientService.getActiveSectorTypes();
        activeData.setSectorTypes(activeSectorTypes.getItems());

        Response<SubSectorResponse> activeSubSectors = rmsConfigurationClientService.getActiveSubSectors();
        activeData.setSubSectors(activeSubSectors.getItems());

        return activeData;
    }

    @GetMapping(path = "get-fyw-sector-sub-sector/{fiscalYearId}", produces = "application/json")
    public Response<FywSectorSubSectorSection> getFywSectorSubSector(@PathVariable Long fiscalYearId){
        return fywSectorSubSectorSectionService.getFywSectorSubSector(fiscalYearId, false);
    }
}
