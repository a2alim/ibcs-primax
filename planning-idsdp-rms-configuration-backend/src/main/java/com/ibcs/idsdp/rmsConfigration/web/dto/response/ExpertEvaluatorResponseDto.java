package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ExpertEvaluatorBySsrcRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ExpertEvaluatorEducationRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ExpertEvaluatorSectorSubSectorRequestDto;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class ExpertEvaluatorResponseDto extends UuidIdHolderRequestBodyDTO {
	private String name;
	private Long userId;
	private String presentProfession;
	private String presentOfficeNameAddress;
	private long stSpecialityTypeId;
	private LocalDate dateOfBirth;
	private String mobileNo;
	private String emailAddress;
	private Boolean thesisGroup;
	private Integer totalResearchExpYear;
	private String researchExperienceDetail;
	private String otherExpertAreas;
	private String nidNumber;
	private String tinNumber;
	private Integer evaluatortype;
	private Integer nationalPublicationsNumber;
	private Integer internationalPublicationsNumber;

	private ExpertEvaluatorBySsrcRequestDto expertEvaluatorBySsrc;
	private List<ExpertEvaluatorEducationRequestDto> educations;
	private List<ExpertEvaluatorSectorSubSectorRequestDto> sectorSubSectors;
}
