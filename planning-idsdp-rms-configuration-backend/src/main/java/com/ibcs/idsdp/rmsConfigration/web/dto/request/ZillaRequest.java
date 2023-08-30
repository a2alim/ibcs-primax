package com.ibcs.idsdp.rmsConfigration.web.dto.request;

import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ZillaRequest extends UuidIdHolderRequestBodyDTO {

	private String code;
	private String geoCode;
	private Long divisionId;
	private String nameEn;
	private String nameBn;
	private String description;
	private Boolean status;

	private DivisionRequest division;

	List<UpaZillaRequest> upaZillas;
}
