package com.ibcs.idsdp.dpptapp.client.dto.response;

import com.ibcs.idsdp.common.web.dto.request.IRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.dpptapp.client.dto.request.MunicipalityRequest;
import com.ibcs.idsdp.dpptapp.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.dpptapp.client.dto.request.ZillaRequest;
import lombok.Data;

import java.util.List;

@Data
public class DivisionZillaUpazilaMunicipalityResponse implements IRequestBodyDTO {

    private List<DivisionRequest> divisions;

    private List<ZillaRequest> zillas;

    private List<UpaZillaRequest> upazilas;

    private List<MunicipalityRequest> municipalitys;

}
