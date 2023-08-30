package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.model.domain.CreateSeminarSendMail;
import com.ibcs.idsdp.rpm.web.dto.request.CreateSeminarSendMailRequestDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
public interface CreateSeminarSendMailService {


    Response<CreateSeminarSendMail> doSave(List<CreateSeminarSendMailRequestDto> requestDto);

    Response<CreateSeminarSendMail> doUpdate(List<CreateSeminarSendMailRequestDto> requestDto);
}
