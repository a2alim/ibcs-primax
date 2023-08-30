package com.ibcs.idsdp.dpptapp.client;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.DevelopmentPartnerResponse;
import com.ibcs.idsdp.common.web.dto.response.ProjectType;
import com.ibcs.idsdp.dpptapp.client.dto.request.*;
import com.ibcs.idsdp.dpptapp.client.dto.response.DivisionZillaUpazilaMunicipalityResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@FeignClient( value = "PLANNING-IDSDP-CONFIGURATION-BACKEND", url = "${feign.client.pps-configuration}")
public interface ConfigurationClientService {

    @PostMapping("subEconomicCode/get-by-id-set")
    public @ResponseBody
    List<SubEconomicCode> getSubEconomicCodeByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @PostMapping("unit-type/get-by-id-set")
    public @ResponseBody
    List<UnitType> getUnitTypeByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @PostMapping("division/get-by-id-set")
    public @ResponseBody List<DivisionRequest> getDivisionByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("division/get-list")
    public @ResponseBody List<DivisionRequest> getAllDivision();

    @PostMapping("zilla/get-by-id-set")
    public @ResponseBody List<ZillaRequest> getZillaByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @PostMapping("zilla/getByDivisionIdSet")
    public @ResponseBody List<ZillaRequest> getByDivisionIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @PostMapping("upazilla/get-by-id-set")
    public @ResponseBody List<UpaZillaRequest> getUpazillaByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("upazilla/get-list")
    public @ResponseBody List<UpaZillaRequest> getAllUpazila();

    @GetMapping("zilla/get-list")
    public @ResponseBody List<ZillaRequest> getAllZilla();

    @PostMapping("upazilla/getByZillaIdSet")
    public @ResponseBody List<UpaZillaRequest> getByZillaIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @PostMapping("municipality/get-by-id-set")
    public @ResponseBody List<MunicipalityRequest> getMunicipalityByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("municipality/get-list")
    public @ResponseBody List<MunicipalityRequest> getAllMunicipality();

    @PostMapping("municipality/getByUpazilaIdSet")
    public @ResponseBody List<MunicipalityRequest> getByUpaZillaIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("division/getAllDivisionZillaUpazilaMunicipalty")
    public @ResponseBody
    DivisionZillaUpazilaMunicipalityResponse getAllActiveDivisionZillaUpazillaMunicipality();

    @PostMapping("economicCode/get-by-id-set")
    public @ResponseBody
    List<EconomicCode> getEconomicCodeByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("sector/get-by-id/{sectorId}")
    public @ResponseBody
    SectorDTO getBySectorId(@PathVariable Long sectorId);

    @GetMapping("subSector/get-by-sub-sector-name-en/{subSectorNameEn}")
    public @ResponseBody
    Optional<SubSectorDTO> getBySubSectorNameEn(@PathVariable String subSectorNameEn);

    @GetMapping("subSector/get-by-id/{subSectorId}")
    public @ResponseBody
    SubSectorDTO getBySubSectorId(@PathVariable Long subSectorId);

    @GetMapping("sectorDivision/get-by-id/{sectorDivisionId}")
    public @ResponseBody
    SectorDivisionDTO getBySectorDivisionId(@PathVariable Long sectorDivisionId);

    @PostMapping("sectorDivision/get-by-id-set")
    public @ResponseBody List<SectorDivisionDTO> getSectorDivisionByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("agency/get-by-name-en/{nameEn}")
    public @ResponseBody
    AgencyDTO getAgencyByNameEn(@PathVariable String nameEn);

    @GetMapping("agency/get-by-id/{id}")
    public @ResponseBody
    AgencyDTO getAgencyById(@PathVariable Long id);

    @GetMapping("ministryDivision/get-by-name-en/{nameEn}")
    public @ResponseBody
    MinistryDivisionDTO getMinistryByNameEn(@PathVariable String nameEn);

    @GetMapping("projectType/get-by-name-en/{nameEn}")
    public @ResponseBody
    ProjectType getProjectTypeByNameEn(@PathVariable String nameEn);

    @GetMapping("developmentPartner/get-by-id/{id}")
    public @ResponseBody
    DevelopmentPartnerResponse getDevelopmentPartnerById(@PathVariable Long id);

    @GetMapping("unit-type/get-by-id/{unitTypeId}")
    @ResponseBody
    UnitType getByUnitTypeId(@PathVariable Long unitTypeId);

    @GetMapping("economicCode/get-by-id/{economicCodeId}")
    @ResponseBody
    EconomicCode getByEconomicCodeId(@PathVariable Long economicCodeId);

    @GetMapping("subEconomicCode/get-by-id/{subEconomicCodeId}")
    @ResponseBody
    SubEconomicCode getBySubEconomicCodeId(@PathVariable Long subEconomicCodeId);

    @PostMapping("procurementMethod/get-by-id-set")
    public @ResponseBody
    List<ProcurementMethod> getProcurementMethodByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @PostMapping("procurementType/get-by-id-set")
    public @ResponseBody
    List<ProcurementType> getProcurementTypeByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("userGroup/getUserGroup")
    public @ResponseBody UserGroupStatusResponse getUserGroupStatusResponse();

    @GetMapping("modeOfFinance/onlyActiveMoveFinData")
    public @ResponseBody
    ResponseEntity<List<ModeOfFinanceDTO>> getActiveModeFinance();
}
