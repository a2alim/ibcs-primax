package com.ibcs.idsdp.feasibilitystudy.client.dto.response;

import com.ibcs.idsdp.common.web.dto.request.IRequestBodyDTO;
import com.ibcs.idsdp.feasibilitystudy.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.feasibilitystudy.client.dto.request.MunicipalityRequest;
import com.ibcs.idsdp.feasibilitystudy.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.feasibilitystudy.client.dto.request.ZillaRequest;
import lombok.Data;

import java.util.List;

@Data
public class DivisionZillaUpazilaMunicipalityResponse implements IRequestBodyDTO {

    private List<DivisionRequest> divisions;

    private List<ZillaRequest> zillas;

    private List<UpaZillaRequest> upazilas;

    private List<MunicipalityRequest> municipalitys;
}
