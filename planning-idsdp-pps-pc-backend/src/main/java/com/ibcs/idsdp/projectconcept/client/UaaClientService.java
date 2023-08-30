package com.ibcs.idsdp.projectconcept.client;


import com.ibcs.idsdp.projectconcept.client.dto.RoleDTO;
import com.ibcs.idsdp.projectconcept.client.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@FeignClient( value = "PLANNING-IDSDP-UAA", url = "${feign.client.uaa}")
//@FeignClient( value = "PLANNING-IDSDP-UAA", url = "http://localhost:8081/")
public interface UaaClientService {

    @GetMapping("user-role/{id}")
    public @ResponseBody ResponseEntity<List<RoleDTO>> getRolesByUserId(@PathVariable("id") Long userId);

    @PostMapping(path = "users/usersByIdSet", produces = "application/json")
    public ResponseEntity<List<UserResponse>> getUserByIdSet(@RequestBody Set<Long> ids);
}
