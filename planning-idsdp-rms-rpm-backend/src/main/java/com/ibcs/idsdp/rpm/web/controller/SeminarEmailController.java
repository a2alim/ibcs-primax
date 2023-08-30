package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.services.SeminarEmailService;
import com.ibcs.idsdp.rpm.web.dto.request.SeminarEmailRequest;
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
@RequestMapping("api/seminar-email")
public class SeminarEmailController {
    private SeminarEmailService seminarEmailService;

    @PostMapping(value = "/create")
    public Response saveSeminarEmail(@RequestBody SeminarEmailRequest seminarEmailRequest) {
        return seminarEmailService.saveSeminarEmail(seminarEmailRequest);
    }


}
