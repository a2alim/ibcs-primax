package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.rpm.enums.LetterType;
import com.ibcs.idsdp.rpm.enums.Status;
import lombok.Data;

/**
 * @author moniruzzaman.rony
 * @create 10/21/21
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
public class LatterRequest {

	private Long researcherProposalId;

	private String subject;

	private String mailBody;

	private boolean mailStatus;

	private LetterType letterType;

	private Status status;

	private Long rmsUserSignatureId;

	private String memorandumNo;

	private String nothiDateEn;

	private String nothiDateBn;

	private String proposalCreatedBy;
}
