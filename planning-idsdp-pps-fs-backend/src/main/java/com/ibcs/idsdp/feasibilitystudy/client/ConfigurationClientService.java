package com.ibcs.idsdp.feasibilitystudy.client;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.feasibilitystudy.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.feasibilitystudy.client.dto.request.MunicipalityRequest;
import com.ibcs.idsdp.feasibilitystudy.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.feasibilitystudy.client.dto.request.ZillaRequest;
import com.ibcs.idsdp.feasibilitystudy.client.dto.response.DivisionZillaUpazilaMunicipalityResponse;
import com.ibcs.idsdp.feasibilitystudy.client.dto.response.UserGroupResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@FeignClient( value = "planning-idsdp-configuration-backend", url = "http://localhost:8081/pps-configuration")
//@FeignClient( value = "planning-idsdp-configuration-backend", url = "http://192.168.1.14:8083/")
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

    @PostMapping("upazilla/get-by-id-set")
    public @ResponseBody List<UpaZillaRequest> getUpazillaByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @PostMapping("upazilla/getByZillaIdSet")
    public @ResponseBody List<UpaZillaRequest> getByZillaIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("upazilla/get-list")
    public @ResponseBody List<UpaZillaRequest> getAllUpazila();

    @PostMapping("municipality/get-by-id-set")
    public @ResponseBody List<MunicipalityRequest> getMunicipalityByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @PostMapping("municipality/getByUpazilaIdSet")
    public @ResponseBody List<MunicipalityRequest> getByUpaZillaIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("municipality/get-list")
    public @ResponseBody List<MunicipalityRequest> getAllMunicipality();

    @GetMapping("division/getAllDivisionZillaUpazilaMunicipalty")
    public @ResponseBody
    DivisionZillaUpazilaMunicipalityResponse getAllActiveDivisionZillaUpazillaMunicipality();

    @GetMapping("userGroup/findByUserId/{userId}")
    public @ResponseBody
    UserGroupResponse getUserGroupByUserId(@PathVariable Long userId);
}
