package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.services.MailService;
import com.ibcs.idsdp.rpm.web.dto.request.MailRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.NewMemberRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.MailResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.NewMemberResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by : rakibul.hasan on 12/9/2021 12:34 PM
 * github : https://github.com/rhmtechno
 */
@RestApiController
@RequestMapping("api/mail-service")
public class MailServiceController {

    private final MailService mailService;

    public MailServiceController(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping(path = "/send-mail", produces = "application/json")
    public ResponseEntity<MailResponseDto> saveOrUpdateNewMemberList(@RequestBody MailRequestDto mailRequestDto) {

        MailResponseDto mailResponseDto = mailService.sendMail(mailRequestDto);
        return  new ResponseEntity<>(mailResponseDto, HttpStatus.OK);
    }

}
