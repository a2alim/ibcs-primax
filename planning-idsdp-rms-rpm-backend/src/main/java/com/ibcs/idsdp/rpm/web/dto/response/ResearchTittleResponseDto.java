package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResearchTittleResponseDto {
	
	Long researcherProfilePersonalInfoMasterId;
	Long m1ResearcherProposalId;
	String researchTitle;
	Long userId;
	UserResponse user;

}
