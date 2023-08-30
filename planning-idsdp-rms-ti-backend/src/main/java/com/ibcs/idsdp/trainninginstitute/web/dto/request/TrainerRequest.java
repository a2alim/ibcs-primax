package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.enums.Gender;
import com.ibcs.idsdp.trainninginstitute.model.domain.AcademicBackgroundModel;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

/**
 * @author moniruzzaman.rony
 * @create 11/17/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
public class TrainerRequest  extends UuidIdHolderRequestBodyDTO{

	private String name;

	private String address;

	private String currentJobInstituteName;

	private String currentPosition;

	private String Phone;

	private String Email;

	private Gender Gender;

	private String lastAcademicDegree;

	private Long fiscalYearId;
	
	 private Long proposalId;

}
