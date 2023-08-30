package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class MemberDTO extends UuidIdHolderRequestBodyDTO {
    private String memberName;
    private String designation;
    private String phone;
    private String email;
    private String role;
}
