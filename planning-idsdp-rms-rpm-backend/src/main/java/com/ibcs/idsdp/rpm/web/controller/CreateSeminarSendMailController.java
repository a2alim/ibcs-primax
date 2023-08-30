package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarSendMail;
import com.ibcs.idsdp.rpm.services.CreateSeminarSendMailService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateSeminarSendMailRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarSendMailResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@RestApiController
@RequestMapping("api/create-seminar-send-mail")
public class CreateSeminarSendMailController extends BaseController<CreateSeminarSendMail, CreateSeminarSendMailRequestDto, CreateSeminarSendMailResponseDto> {

    private final CreateSeminarSendMailService createSeminarSendMailService;

    public CreateSeminarSendMailController(BaseService<CreateSeminarSendMail, CreateSeminarSendMailRequestDto, CreateSeminarSendMailResponseDto> service, CreateSeminarSendMailService createSeminarSendMailService) {
        super(service);
        this.createSeminarSendMailService = createSeminarSendMailService;
    }

    //for saving arrayList
    @PostMapping(path = "/create-list", produces = "application/json")
    public ResponseEntity<Object> saveAgreementInstallment(@RequestBody List<CreateSeminarSendMailRequestDto> requestDto) {
        Response<CreateSeminarSendMail> res = createSeminarSendMailService.doSave(requestDto);
        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }


    //for update arrayList
    @PutMapping(path = "/update-list", produces = "application/json")
    public ResponseEntity<Object> updateAgreementInstallment(@RequestBody List<CreateSeminarSendMailRequestDto> requestDto) {
        Response<CreateSeminarSendMail> res = createSeminarSendMailService.doUpdate(requestDto);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}
