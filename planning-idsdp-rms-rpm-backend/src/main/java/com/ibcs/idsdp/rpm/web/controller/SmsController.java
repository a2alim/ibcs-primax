package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.services.SmsService;
import com.ibcs.idsdp.rpm.web.dto.request.SmsDto;
import com.ibcs.idsdp.rpm.web.dto.response.uua.OtpRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.uua.OtpResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */

@RestApiController
@RequestMapping("api/sms")
@RequiredArgsConstructor
public class SmsController {

    private final SmsService smsService;
    private final UaaClientService uaaClientService;


    @PostMapping(value = "send", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Response sendSms(@RequestBody SmsDto smsDto) {
        Boolean smsApiEnable = smsService.getSmsApiEnable();
        Response<String> response = new Response<>();
        if (smsApiEnable) {
            String smsResponse = smsService.sendSms(smsDto);
            response.setSuccess(true);
            response.setMessage("Sms Sent Successfully");
            response.setObj(smsResponse);
        } else {
            response.setSuccess(false);
            response.setMessage("sms Disabled");
        }


        return response;

    }


    @PostMapping(value = "send/otp", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Response sendOtpSms(@RequestBody SmsDto smsDto) {
        String smsApiText = smsService.getSmsApiText();
        String replace = smsApiText.replace("#otp#", String.valueOf(smsDto.getMessage()));
        smsDto.setMessage(replace);
        Boolean smsApiEnable = smsService.getSmsApiEnable();
        Response<String> response = new Response<>();
        if (smsApiEnable) {
            String smsResponse = smsService.sendSms(smsDto);
            response.setSuccess(true);
            response.setMessage("Sms Sent Successfully");
            response.setObj(smsResponse);
        } else {
            response.setSuccess(false);
            response.setMessage("Sms Disabled");
        }
        return response;

    }

    /*
     * For send Otp from profile
     * */


    @PostMapping(value = "send/otp/{id}", produces = "application/json")
    public OtpResponseDto sendOtpSms(@PathVariable Long id) {
        Boolean smsApiEnable = smsService.getSmsApiEnable();

        if (smsApiEnable) {
            OtpResponseDto otpResponseDto = uaaClientService.sendOtpForPv(id);

            if (otpResponseDto.getStatus()) {
                return otpResponseDto;
            } else {
                return otpResponseDto;
            }
        } else {
            return new OtpResponseDto() {{
                setStatus(false);
                setMessage("Sms Api Disabled");
            }};
        }

    }


    @PostMapping(value = "profile/otp/verify", produces = "application/json")
    public ResponseEntity<OtpResponseDto> veryFyOtpSms(@RequestBody OtpRequestDto otpRequestDto) {

        return uaaClientService.verifyForPv(otpRequestDto);
    }


    @PostMapping(value = "profile/otp/resend/{id}", produces = "application/json")
    public ResponseEntity<OtpResponseDto> resendOtpSms(@PathVariable("id") Long id) {
        return uaaClientService.otpResends(id);
    }


}
