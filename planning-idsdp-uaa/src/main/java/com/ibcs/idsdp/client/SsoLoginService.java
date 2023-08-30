package com.ibcs.idsdp.client;

import com.ibcs.idsdp.web.dto.request.SsoRequest;
import com.ibcs.idsdp.web.dto.response.SsoUserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

//@FeignClient(value = "planning-idsdp-sso-backend", url = "http://localhost:8088/sso/")
@FeignClient(value = "planning-idsdp-sso-backend", url = "${feign.client.sso}")
public interface SsoLoginService {

    @PostMapping("doptor-sso")
    ResponseEntity<SsoUserResponse> ssoLogin(@RequestBody SsoRequest ssoRequest);

}
