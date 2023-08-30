package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

/**
 * @author moniruzzaman.rony
 * @create 10/12/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
public class RelativeInfoRequest extends UuidIdHolderRequestBodyDTO{
	
    Long profilePersonalInfoId;
    String name;
    String email;
    String phoneNo;
    String presentAddress;
    String permanentAddress;
    String nid;
    Boolean isEditable;    
    Integer isDeleted=0;
}
