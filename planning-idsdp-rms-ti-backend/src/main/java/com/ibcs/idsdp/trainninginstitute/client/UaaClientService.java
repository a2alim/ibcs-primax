package com.ibcs.idsdp.trainninginstitute.client;

import com.ibcs.idsdp.trainninginstitute.client.dto.response.User;
import com.ibcs.idsdp.trainninginstitute.client.dto.response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

//@FeignClient(value = "planning-idsdp-uaa", url = "http://202.161.191.131:9403/api/")
@FeignClient(value = "planning-idsdp-uaa", url = "${feign.client.uaa}")
public interface UaaClientService {
    @GetMapping(path = "users/all", produces = "application/json")
    List<User> getAllUsers();

    @GetMapping(path = "users/{id}", produces = "application/json")
    UserResponse getUserById(@PathVariable("id") Long id);
}
