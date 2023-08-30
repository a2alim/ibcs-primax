package com.ibcs.idsdp.rpm.web.dto.response;

import lombok.Data;

@Data
public class RelativeInfoResponse{
    long profilePersonalInfoId;
    String name;
    String email;
    String phoneNo;
    String presentAddress;
    String permanentAddress;
    String nid;
    boolean isEditable;

}
