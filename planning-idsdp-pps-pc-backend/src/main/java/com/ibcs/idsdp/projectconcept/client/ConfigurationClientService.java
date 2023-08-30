package com.ibcs.idsdp.projectconcept.client;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.projectconcept.client.dto.AgencyDTO;
import com.ibcs.idsdp.projectconcept.client.dto.CategoryDTO;
import com.ibcs.idsdp.projectconcept.client.dto.SectorDTO;
import com.ibcs.idsdp.projectconcept.client.dto.SubSectorDTO;
import com.ibcs.idsdp.projectconcept.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.projectconcept.client.dto.request.MunicipalityRequest;
import com.ibcs.idsdp.projectconcept.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.projectconcept.client.dto.request.ZillaRequest;
import com.ibcs.idsdp.projectconcept.client.dto.response.DivisionZillaUpazilaMunicipalityResponse;
import com.ibcs.idsdp.projectconcept.client.dto.response.MinistryDivision;
import com.ibcs.idsdp.projectconcept.client.dto.response.UserGroupResponse;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectTypeDTO;
import com.ibcs.idsdp.projectconcept.web.dto.response.ParipatraVersionDTO;
import com.ibcs.idsdp.projectconcept.web.dto.response.PriorityDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@FeignClient( value = "planning-idsdp-configuration-backend", url = "http://localhost:8081/pps-configuration")
//@FeignClient( value = "planning-idsdp-configuration-backend", url = "http://202.161.191.131:9403/pps-configuration/")
@FeignClient( value = "planning-idsdp-configuration-backend", url = "${feign.client.pps-configuration}")
public interface ConfigurationClientService {

    @PostMapping("division/get-by-id-set")
    public @ResponseBody List<DivisionRequest> getDivisionByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("division/get-list")
    public @ResponseBody List<DivisionRequest> getAllDivision();

    @PostMapping("zilla/get-by-id-set")
    public @ResponseBody List<ZillaRequest> getZillaByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @PostMapping("zilla/getByDivisionIdSet")
    public @ResponseBody List<ZillaRequest> getByDivisionIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("zilla/get-list")
    public @ResponseBody List<ZillaRequest> getAllZilla();

    @GetMapping("zilla/get-by-division-geo-code/{divisionGeoCode}")
    public @ResponseBody List<ZillaRequest> getZillaByDivisionGeoCode(@PathVariable String divisionGeoCode);

    @PostMapping("upazilla/get-by-id-set")
    public @ResponseBody List<UpaZillaRequest> getUpazillaByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @PostMapping("upazilla/getByZillaIdSet")
    public @ResponseBody List<UpaZillaRequest> getByZillaIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("upazilla/get-list")
    public @ResponseBody List<UpaZillaRequest> getAllUpazila();

    @GetMapping("upazilla/get-by-zilla-geo-code/{zillaGeoCode}")
    public @ResponseBody List<UpaZillaRequest> getUpazillaByZillaGeoCode(@PathVariable String zillaGeoCode);

    @PostMapping("municipality/get-by-id-set")
    public @ResponseBody List<MunicipalityRequest> getMunicipalityByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @PostMapping("municipality/getByUpazilaIdSet")
    public @ResponseBody List<MunicipalityRequest> getByUpaZillaIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("municipality/get-list")
    public @ResponseBody List<MunicipalityRequest> getAllMunicipality();

    @PostMapping("projectType/get-by-id-set")
    public @ResponseBody List<ProjectTypeDTO> getProjectTypeByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("projectType/get-by-id/{id}")
    public @ResponseBody ProjectTypeDTO getProjectTypeById(@PathVariable Long id);

    @GetMapping("projectType/get-by-name-en/{nameEn}")
    public @ResponseBody
    ProjectTypeDTO getProjectTypeByNameEn(@PathVariable String nameEn);

    @GetMapping("division/getAllDivisionZillaUpazilaMunicipalty")
    public @ResponseBody
    DivisionZillaUpazilaMunicipalityResponse getAllActiveDivisionZillaUpazillaMunicipality();

    @GetMapping("userGroup/findByUserId/{userId}")
    public @ResponseBody
    UserGroupResponse getUserGroupByUserId(@PathVariable Long userId);

    @GetMapping("agency/getAllActiveAgencyByMinistryId/{ministryDivisionId}")
    public @ResponseBody
    ResponseEntity<List<AgencyDTO>> getByMinistryDivisionId(@PathVariable Long ministryDivisionId);

    @PostMapping("agency/get-by-id-set")
    public @ResponseBody
    List<AgencyDTO> getAgencyByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("agency/get-by-name-en/{nameEn}")
    public @ResponseBody
    AgencyDTO getAgencyByNameEn(@PathVariable String nameEn);

    @GetMapping("agency/get-by-code/{code}")
    public @ResponseBody
    AgencyDTO getAgencyByCode(@PathVariable String code);

    @GetMapping("ministryDivision/get-by-code/{code}")
    public @ResponseBody
    MinistryDivision getMinistryDivisionByCode(@PathVariable String code);

    @GetMapping("paripatraVersion/get-by-id/{id}")
    public @ResponseBody ParipatraVersionDTO getParipatraById(@PathVariable Long id);

    @GetMapping("paripatraVersion/getActiveParipatraList")
    public @ResponseBody List<ParipatraVersionDTO> getActiveParipatraList();

    @GetMapping("priority/getActivePriority")
    public @ResponseBody ResponseEntity<List<PriorityDTO>> getActivePriority();

    @GetMapping("subSector/get-by-sub-sector-code/{subSectorCode}")
    public @ResponseBody
    SubSectorDTO getBySubSectorCode(@PathVariable String subSectorCode);

    @GetMapping("sector/get-by-id/{sectorId}")
    public @ResponseBody
    SectorDTO getBySectorId(@PathVariable Long sectorId);

    @GetMapping("category/getActiveCategory")
    public @ResponseBody
    List<CategoryDTO> getActiveCategory();
}
