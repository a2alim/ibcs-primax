package com.ibcs.idsdp.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class IdentityResponse {

	private Long id;
	private String errorMessage;

	public  IdentityResponse(Long id) {
		this.id = id;
	}

	public  IdentityResponse(String errorMessage) {
		this.errorMessage = errorMessage;
	}
}
