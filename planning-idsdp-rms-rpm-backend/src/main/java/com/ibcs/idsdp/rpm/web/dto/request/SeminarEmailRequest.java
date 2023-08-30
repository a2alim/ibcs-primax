package com.ibcs.idsdp.rpm.web.dto.request;

import lombok.Data;

/**
 * @author moniruzzaman.rony
 * @create 11/23/21
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
public class SeminarEmailRequest {

    private Long committeeTypeId;

    private String to;

    private String subject;

    private String mailBody;

    private String seminarId;

}
