package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

/**
 * @author moniruzzaman.rony
 * @create 10/12/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
public class ProfileTrainingRequest extends UuidIdHolderRequestBodyDTO{
    Long profilePersonalInfoId;
    String trainingName;
    String instituteOrCenterName;
    String duration;
    String result;
    Boolean isEditable;
    Integer isDeleted=0;
    String trainingTopic;
}
