package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.MailRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.MailResponseDto;

import java.util.Map;

/**
 * Created by : rakibul.hasan on 12/9/2021 12:12 PM
 * github : https://github.com/rhmtechno
 */
public interface MailService {
    MailResponseDto sendMail(MailRequestDto request);

}
