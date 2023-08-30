package com.ibcs.idsdp.rpm.web.dto.response;

import lombok.Data;

@Data
public class ProfileTrainingResponse {
    long profilePersonalInfoId;
    String trainingName;
    String instituteOrCenterName;
    String duration;
    String result;
    boolean isEditable;

}
