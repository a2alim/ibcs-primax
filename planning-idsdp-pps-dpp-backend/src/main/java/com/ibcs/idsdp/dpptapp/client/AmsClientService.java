package com.ibcs.idsdp.dpptapp.client;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.web.dto.amsDTO.AmsAccessTokenResponseDTO;
import com.ibcs.idsdp.dpptapp.web.dto.amsDTO.AmsGreenPageResponseDTO;
import com.ibcs.idsdp.dpptapp.web.dto.amsDTO.AmsUnapprovedProjectResponseDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.AmsUnapprovedProjectDetailInfoDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.UnitType;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


//@FeignClient(value = "AMS-BACKEND", url = "${feign.client.ams-backend}")
@FeignClient( value = "AMS-BACKEND", url = "http://103.30.189.229:9494")
public interface AmsClientService {

    @PostMapping("api/getAccessToken?user_name={user_name}&password={password}")
    public @ResponseBody
    AmsAccessTokenResponseDTO getAmsAccessToken(@PathVariable String user_name, @PathVariable String password);

    @PostMapping("api/recommandedproject?access_token={access_token}&ministryCode={ministryCode}&agencyCode={agencyCode}&financialYear={financialYear}&programType={programType}")
    public @ResponseBody
    AmsGreenPageResponseDTO getAmsGreenPageProject(@PathVariable String access_token,@PathVariable String ministryCode,@PathVariable String agencyCode,@PathVariable String financialYear, @PathVariable Long programType);

    @PostMapping("api/recommandedProjectFeedback?access_token={access_token}&amsId={amsId}&amsCode={amsCode}&ppsCode={ppsCode}")
    public @ResponseBody
    AmsAccessTokenResponseDTO sendAmsGreenPageProjectFeedback(@PathVariable String access_token, @PathVariable int amsId,
                                                              @PathVariable String amsCode, @PathVariable String ppsCode);

    @PostMapping("api/ppsUnapprovedProjectEntry")
    public @ResponseBody
    AmsUnapprovedProjectResponseDTO sendAmsGreenPageProjectFeedback(@RequestHeader Map<String,Object> headerMap,
                                                                    @RequestBody AmsUnapprovedProjectDetailInfoDTO request);

}
