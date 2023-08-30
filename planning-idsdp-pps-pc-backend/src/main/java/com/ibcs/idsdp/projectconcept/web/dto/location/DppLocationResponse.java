package com.ibcs.idsdp.projectconcept.web.dto.location;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.projectconcept.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.projectconcept.client.dto.request.MunicipalityRequest;
import com.ibcs.idsdp.projectconcept.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.projectconcept.client.dto.request.ZillaRequest;
import lombok.Data;

import java.util.List;

@Data
public class DppLocationResponse extends UuidIdHolderRequestBodyDTO {
    private Long projectConceptMasterId;
    private Long dppMasterId;
    private List<DivisionRequest> divisions;
    private List<ZillaRequest> zillas;
    private List<UpaZillaRequest> upazilas;
    private List<MunicipalityRequest> municipalitys;
}
