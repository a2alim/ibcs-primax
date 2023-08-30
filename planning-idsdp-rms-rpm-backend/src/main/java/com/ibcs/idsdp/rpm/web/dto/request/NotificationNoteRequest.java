package com.ibcs.idsdp.rpm.web.dto.request;

import lombok.Data;

import javax.persistence.Column;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

/**
 * @author moniruzzaman.rony
 * @create 10/21/21
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
public class NotificationNoteRequest extends UuidIdHolderRequestBodyDTO {

    private String note;

    private boolean isAccept;

}
