package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ZillaRequest;

import lombok.Data;

@Data
public class DivisionResponse extends UuidIdHolderRequestBodyDTO{

	private String code;
	private String geoCode;
	private String nameEn;
	private String nameBn;
	private String description;
	private Boolean status;

	List<ZillaRequest> zillas;

}
