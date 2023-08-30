package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class TappAnnexureThreeRequest extends UuidIdHolderRequestBodyDTO {

    public List<TappAnnexureThreeDetailsRequest> consultantsList;


}
