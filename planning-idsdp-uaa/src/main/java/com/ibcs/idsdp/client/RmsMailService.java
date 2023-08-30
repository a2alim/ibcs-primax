package com.ibcs.idsdp.client;

import com.ibcs.idsdp.web.dto.request.MailRequestDto;
import com.ibcs.idsdp.web.dto.request.SmsDto;
import com.ibcs.idsdp.web.dto.response.MailResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Created by : rakibul.hasan on 12/9/2021 3:17 PM
 * github : https://github.com/rhmtechno
 */
@FeignClient(value = "planning-idsdp-rms-rpm-backend", url = "${feign.client.rms-rpm}")
public interface RmsMailService {

    @PostMapping("api/mail-service/send-mail")
    MailResponseDto sendMail(MailRequestDto request);

    @PostMapping( "api/sms/send/otp")
    void sendOtpSms(@RequestBody SmsDto smsDto);
}
