package com.ibcs.idsdp.projectconcept.web.dto.location;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.projectconcept.client.dto.request.DivisionRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class LocationAndCostResponse extends UuidIdHolderRequestBodyDTO {

    private Long dppMasterId;

    private List<DivisionRequest> divisions;
}
