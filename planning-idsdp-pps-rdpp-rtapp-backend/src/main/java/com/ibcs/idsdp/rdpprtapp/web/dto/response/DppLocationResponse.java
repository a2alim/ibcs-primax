package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rdpprtapp.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.rdpprtapp.client.dto.request.MunicipalityRequest;
import com.ibcs.idsdp.rdpprtapp.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.rdpprtapp.client.dto.request.ZillaRequest;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class DppLocationResponse extends UuidIdHolderRequestBodyDTO {

    private Long projectConceptMasterId;

    private Long rdppMasterId;

    private List<DivisionRequest> divisions;

    private List<ZillaRequest> zillas;

    private List<UpaZillaRequest> upazilas;

    private List<MunicipalityRequest> municipalitys;

    private String status;
}
