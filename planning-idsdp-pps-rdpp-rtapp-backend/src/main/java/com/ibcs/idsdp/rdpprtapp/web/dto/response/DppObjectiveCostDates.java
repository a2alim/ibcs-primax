package com.ibcs.idsdp.rdpprtapp.web.dto.response;


import lombok.Data;

import java.time.LocalDate;

@Data
public class DppObjectiveCostDates {
	private Long rdppMasterId;
	private LocalDate dateCommencement;
	private LocalDate dateCompletion;
	private String revisedVersion;
	private String revisedVersionBn;
}
