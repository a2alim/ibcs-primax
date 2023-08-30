package com.ibcs.idsdp.common.client;

import com.ibcs.idsdp.common.client.dto.response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Set;


// @FeignClient(value = "planning-idsdp-uaa", url = "http://localhost:8081/api/")
@FeignClient(value = "planning-idsdp-uaa", url = "${feign.client.uaa}")
public interface UUAClient {
	@PostMapping(path = "users/usersByIdSet", produces = "application/json")
	ResponseEntity<List<UserResponse>> getUsersByIdSet(@RequestBody Set<Long> ids);

	@GetMapping(path = "users/{id}", produces = "application/json")
	ResponseEntity<UserResponse> getUserById(@PathVariable(value = "id") Long id);

}

