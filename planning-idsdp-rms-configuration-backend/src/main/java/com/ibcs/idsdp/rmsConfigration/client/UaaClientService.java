package com.ibcs.idsdp.rmsConfigration.client;

import com.ibcs.idsdp.rmsConfigration.client.dto.request.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

//@FeignClient(value = "planning-idsdp-uaa", url = "http://localhost:8080/api/")
@FeignClient(value = "planning-idsdp-uaa", url = "${feign.client.uaa}")
public interface UaaClientService {
    @GetMapping(path = "users/all", produces = "application/json")
    List<User> getAllUsers();


}
