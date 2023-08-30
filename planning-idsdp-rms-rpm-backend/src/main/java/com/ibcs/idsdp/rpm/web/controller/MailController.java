package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.services.MailService;
import com.ibcs.idsdp.rpm.web.dto.request.MailRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.MailResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */

@RestApiController
@AllArgsConstructor
@RequestMapping("api/mail")
public class MailController {

    private final MailService mailService;

    @PostMapping(value = "send", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Response sendMail(@RequestBody MailRequestDto mailRequestDto) {
        Response<MailResponseDto> response = new Response<>();
        try {
            MailResponseDto mailResponseDto = mailService.sendMail(mailRequestDto);
            response.setSuccess(true);
            response.setMessage("Sms Sent Successfully");
            response.setObj(mailResponseDto);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("sms Disabled");
        }


        return response;

    }

}
