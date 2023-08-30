package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import lombok.Data;

/**
 * @author rakibul.hasan
 * @create 10/26/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class CreateSeminarSendMailResponseDto extends UuidIdHolderRequestBodyDTO {

    private Long seminarId;
    private CreateSeminar m2CreateSeminarId;
    private String receiverEmailAddress;
    private String mailBody;
    private Boolean isSend;
}
