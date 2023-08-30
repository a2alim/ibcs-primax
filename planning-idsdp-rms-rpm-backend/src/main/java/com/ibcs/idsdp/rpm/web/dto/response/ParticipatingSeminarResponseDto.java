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
public class ParticipatingSeminarResponseDto extends UuidIdHolderRequestBodyDTO {

    private CreateSeminar m2CreateSeminarId;
    private String participantsList;
}
