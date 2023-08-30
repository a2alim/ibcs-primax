package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.rpm.client.dto.response.DivisionResponse;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.SectorTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.SubSectorResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.UpaZillaResponse;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.client.dto.response.ZillaResponse;

import lombok.Data;

@Data
public class LetterDetailsResponseDto {

	private String researchTitle;
	private Long stResearchCatTypeId;
	private Long stSectorTypeId;

	private Long stSubSectorsId;
	private Long stFiscalYearId;

	private String stSdgsGoalsId;
	private String emailAddress;

	private String mobileNo;
	private String instTelephoneNo;
	private String regNumber;
	private String userImageUrl;
	private String signatureImageUr;
	private String minio;

	private String memorandumNo;
	private String nothiDateEn;
	private String nothiDateBn;
	private Long userId;
	private Long preDivisionId;
	private Long preDistrictId;
	private Long preUpzilaId;
	private Boolean isInstitutional;
	private String instAddressDetails;
	private String subject;
	private String mailBody;
	private Boolean mailStatus;

	private ResearchCategoryTypeResponseDto researchCategoryTypeResponseDto;
	private SectorTypeResponseDto sectorTypeResponseDto;
	private SubSectorResponseDto subSectorResponseDto;
	private FiscalResponseDto fiscalResponseDto;
	private UserResponse userDto;
	private DivisionResponse preDivisionDto;
	private ZillaResponse preDistrictDto;
	private UpaZillaResponse preUpzilaDto;

}
