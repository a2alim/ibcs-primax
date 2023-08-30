package com.ibcs.idsdp.rpm.client;

import java.util.List;
import java.util.Set;

import com.ibcs.idsdp.rpm.web.dto.response.eNothi.EnothiResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.ibcs.idsdp.rpm.client.dto.request.UserDtl;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.web.dto.response.uua.OtpRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.uua.OtpResponseDto;

//@FeignClient(value = "planning-idsdp-uaa", url = "http://202.161.191.131:9403/api/")
@FeignClient(value = "planning-idsdp-uaa", url = "${feign.client.uaa}")
public interface UaaClientService {

    @GetMapping(path = "users/all", produces = "application/json")
    List<UserDtl> getAllUsers();

    @PostMapping(path = "users/usersByIdSet", produces = "application/json")
    ResponseEntity<List<UserResponse>> getUserByIdSet(@RequestBody Set<Long> ids);

    @GetMapping(value = "users/{id}", produces = "application/json")
    public ResponseEntity<UserResponse> getUser(@PathVariable("id") Long userId);

    @PostMapping(path = "rms-verification/otp/profile/{id}", produces = "application/json")
    OtpResponseDto sendOtpForPv(@PathVariable("id") Long id);

    @PostMapping(path = "rms-verification/otp", produces = "application/json")
    ResponseEntity<OtpResponseDto> verifyForPv(@RequestBody OtpRequestDto otpRequestDto);

    @PostMapping(value = "rms-verification/otp/resend/{userId}", produces = "application/json")
     ResponseEntity<OtpResponseDto> otpResends(@PathVariable Long userId );

    @GetMapping(value = "users/userType/{type}", produces = "application/json")
    List<UserDtl> getUserByUserType(@PathVariable("type") String type);
    
    
   
    

}
