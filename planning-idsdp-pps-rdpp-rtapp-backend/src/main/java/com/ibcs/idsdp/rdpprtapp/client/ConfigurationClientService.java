package com.ibcs.idsdp.rdpprtapp.client;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.rdpprtapp.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.rdpprtapp.client.dto.request.MunicipalityRequest;
import com.ibcs.idsdp.rdpprtapp.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.rdpprtapp.client.dto.request.ZillaRequest;
import com.ibcs.idsdp.rdpprtapp.client.dto.response.DivisionZillaUpazilaMunicipalityResponse;
import com.ibcs.idsdp.rdpprtapp.client.dto.response.MinistryDivisionDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@FeignClient( value = "planning-idsdp-configuration-backend", url = "http://localhost:8081/pps-configuration")
@FeignClient( value = "PLANNING-IDSDP-CONFIGURATION-BACKEND", url = "${feign.client.pps-configuration}")
public interface ConfigurationClientService {

    @GetMapping("agency/getAllActiveAgencyByMinistryId/{ministryDivisionId}")
    public @ResponseBody
    ResponseEntity<List<Agency>> getByMinistryDivisionId(@PathVariable Long ministryDivisionId);

    @GetMapping("agency/get-by-name-en/{nameEn}")
    public @ResponseBody
    Agency getAgencyByNameEn(@PathVariable String nameEn);

    @GetMapping("ministryDivision/get-by-name-en/{nameEn}")
    public @ResponseBody
    MinistryDivisionDTO getMinistryByNameEn(@PathVariable String nameEn);

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

    @GetMapping("userGroup/findByUserId/{userId}")
    @ResponseBody
    UserGroupResponse getUserGroupByUserId(@PathVariable Long userId);

    @GetMapping("economicCode/get-by-id/{userId}")
    @ResponseBody
    EconomicCode getEconomicCodeNameById(@PathVariable Long userId);

    @GetMapping("subEconomicCode/get-by-id/{userId}")
    @ResponseBody
    SubEconomicCode getSubEconomicCodeNameById(@PathVariable Long userId);

    @GetMapping("unit-type/get-by-id/{userId}")
    @ResponseBody
    UnitType getUnitNameById(@PathVariable Long userId);

    @GetMapping("sectorDivision/get-by-id/{userId}")
    @ResponseBody
    SectorDivision getSectorDivisionById(@PathVariable Long userId);

    @GetMapping("sectorDivision/get-by-id/{sectorDivisionId}")
    public @ResponseBody
    SectorDivision getBySectorDivisionId(@PathVariable Long sectorDivisionId);

    @GetMapping("sector/get-by-id/{sectorId}")
    public @ResponseBody
    SectorDTO getBySectorId(@PathVariable Long sectorId);

    @GetMapping("procurementType/get-by-id/{userId}")
    @ResponseBody
    ProcurementTypeResponse getProcurementTypeById(@PathVariable Long userId);

    @GetMapping("procurementMethod/get-by-id/{userId}")
    @ResponseBody
    ProcurementMethodResponse getProcurementMethodById(@PathVariable Long userId);

    @GetMapping("developmentPartner/get-by-id/{id}")
    public @ResponseBody
    DevelopmentPartnerResponse getDevelopmentPartnerById(@PathVariable Long id);
}
