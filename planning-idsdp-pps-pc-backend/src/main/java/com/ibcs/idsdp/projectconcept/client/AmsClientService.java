package com.ibcs.idsdp.projectconcept.client;

import com.ibcs.idsdp.projectconcept.web.dto.amsDTO.AmsAccessTokenResponseDTO;
import com.ibcs.idsdp.projectconcept.web.dto.amsDTO.AmsFeedbackResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;


//@FeignClient(value = "AMS-BACKEND", url = "${feign.client.ams-backend}")
@FeignClient( value = "AMS-BACKEND", url = "http://103.30.189.229:9494")
public interface AmsClientService {

    @PostMapping("api/getAccessToken?user_name={user_name}&password={password}")
    public @ResponseBody
    AmsAccessTokenResponseDTO getAmsAccessToken(@PathVariable String user_name, @PathVariable String password);

    @PostMapping("api/recommandedProjectFeedback?access_token={access_token}&amsId={amsId}&amsCode={amsCode}&ppsCode={ppsCode}")
    public @ResponseBody
    AmsFeedbackResponseDTO sendAmsGreenPageProjectFeedback(@PathVariable String access_token, @PathVariable Long amsId,
                                                           @PathVariable String amsCode, @PathVariable String ppsCode);

}
