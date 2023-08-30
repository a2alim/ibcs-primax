package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.SeminarEmailRequest;
import com.ibcs.idsdp.util.Response;

/**
 * @author moniruzzaman.rony
 * @create 11/23/21
 * @github `https://github.com/moniruzzamanrony`
 */
public interface SeminarEmailService {
    Response saveSeminarEmail(SeminarEmailRequest seminarEmailRequest);
}
