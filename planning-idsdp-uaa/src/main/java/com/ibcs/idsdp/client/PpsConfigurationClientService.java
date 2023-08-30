package com.ibcs.idsdp.client;

import com.ibcs.idsdp.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.web.dto.response.AgencyDTO;
import com.ibcs.idsdp.web.dto.response.MinistryDivisionDTO;
import com.ibcs.idsdp.web.dto.response.UserGroupDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@FeignClient( value = "PLANNING-IDSDP-CONFIGURATION-BACKEND", url = "${feign.client.pps-configuration}")
public interface PpsConfigurationClientService {

    @GetMapping("agency/get-by-id/{id}")
    public @ResponseBody
    AgencyDTO getAgencyById(@PathVariable Long id);

    @PostMapping("agency/get-by-id-set")
    public @ResponseBody
    List<AgencyDTO> getAgencyByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("ministryDivision/get-by-id/{id}")
    public @ResponseBody
    MinistryDivisionDTO getMinistryDivisionById(@PathVariable Long id);

    @PostMapping("ministryDivision/get-by-id-set")
    public @ResponseBody
    List<MinistryDivisionDTO> getMinistryDivisionByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @PostMapping("userGroup/get-by-user-id-set")
    public @ResponseBody
    List<UserGroupDTO> getUserGroupByUserIdSet(@RequestHeader Map<String, Object> headerMap, @RequestBody IdSetRequestBodyDTO requestBodyDTO);

    @GetMapping("userGroup/getByMinistryDivisionId/{ministryDivisionId}")
    public @ResponseBody
    List<UserGroupDTO> getUserGroupByMinistryDivisionId(@RequestHeader Map<String, Object> headerMap, @PathVariable Long ministryDivisionId);

    @GetMapping("userGroup/getByAgencyId/{agencyId}")
    public @ResponseBody
    List<UserGroupDTO> getUserGroupByAgencyId(@RequestHeader Map<String, Object> headerMap, @PathVariable Long agencyId);
}
