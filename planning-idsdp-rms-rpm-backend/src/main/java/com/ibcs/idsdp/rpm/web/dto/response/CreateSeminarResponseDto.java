package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

/**
 * @author rakibul.hasan
 * @create 10/26/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class CreateSeminarResponseDto extends UuidIdHolderRequestBodyDTO {

	private Long stFiscalYearId;

	private String subject;

	private Long seminarNo;

	private Long presentationType;

	private Long presentationStatus;

	private Long programNature;

	private Long totalPresentationNo;

	private Date startDate;

	private Date endDate;

	private String dayName;

	private String presentationTime;

	private String bhavanNo;

	private String roomNo;

	private String roomName;

	private String paragraphOne;

	private String paragraphTwo;

	private Boolean isEditable;

	private boolean isMailSent;

	private String memorandumNo;

	private String nothiDateEn;

	private String nothiDateBn;
	
	private String letterType;
	
	private LocalDate seminarDate;


}
