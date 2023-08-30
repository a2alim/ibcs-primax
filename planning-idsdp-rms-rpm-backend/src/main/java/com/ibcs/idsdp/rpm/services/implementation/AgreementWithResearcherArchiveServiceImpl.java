package com.ibcs.idsdp.rpm.services.implementation;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcherArchive;
import com.ibcs.idsdp.rpm.model.repositories.AgreementWithResearcherArchiveRepository;
import com.ibcs.idsdp.rpm.services.AgreementWithResearcherArchiveService;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementWithResearcherArchiveRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementWithResearcherArchiveResponseDto;

@Service
@Transactional
public class AgreementWithResearcherArchiveServiceImpl extends BaseService<AgreementWithResearcherArchive, AgreementWithResearcherArchiveRequestDto, AgreementWithResearcherArchiveResponseDto> implements AgreementWithResearcherArchiveService {

	private final AgreementWithResearcherArchiveRepository agreementWithResearcherArchiveRepository;
	
	public AgreementWithResearcherArchiveServiceImpl(ServiceRepository<AgreementWithResearcherArchive> repository,
			AgreementWithResearcherArchiveRepository agreementWithResearcherArchiveRepository) {
		super(repository);
		this.agreementWithResearcherArchiveRepository = agreementWithResearcherArchiveRepository;
	}

	@Override
	public AgreementWithResearcherArchive save(AgreementWithResearcherArchive agreementWithResearcherArchive) {

		Optional<AgreementWithResearcherArchive> result = agreementWithResearcherArchiveRepository.findById(agreementWithResearcherArchive.getId());
		AgreementWithResearcherArchive a = new AgreementWithResearcherArchive();
		if(result.isPresent()) a = result.get();

		BeanUtils.copyProperties(agreementWithResearcherArchive, a);

		return agreementWithResearcherArchiveRepository.save(a);
	}

}
