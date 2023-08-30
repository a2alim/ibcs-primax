package com.ibcs.idsdp.rpm.services.implementation;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.model.domain.AgreementInstallment;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.model.repositories.AgreementInstallmentRepository;
import com.ibcs.idsdp.rpm.model.repositories.AgreementWithResearcherRepository;
import com.ibcs.idsdp.rpm.services.AgreementInstallmentService;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementInstallmentRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.InstallmentTypeResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.AgreementInstallmentResponseDto;
import com.ibcs.idsdp.util.Response;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@Transactional
public class AgreementInstallmentServiceImpl
		extends BaseService<AgreementInstallment, AgreementInstallmentRequestDto, AgreementInstallmentResponseDto>
		implements AgreementInstallmentService {

	private final AgreementInstallmentRepository agreementInstallmentRepository;

	private final AgreementWithResearcherRepository agreementWithResearcherRepository;

	private final RmsConfigurationClientService rmsConfigurationClientService;

	public AgreementInstallmentServiceImpl(ServiceRepository<AgreementInstallment> repository,
			AgreementInstallmentRepository agreementInstallmentRepository,
			AgreementWithResearcherRepository agreementWithResearcherRepository,
			RmsConfigurationClientService rmsConfigurationClientService) {
		super(repository);
		this.agreementInstallmentRepository = agreementInstallmentRepository;
		this.agreementWithResearcherRepository = agreementWithResearcherRepository;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
	}

	@Override
	public Response<AgreementInstallmentResponseDto> createAgreementInstallment(
			AgreementInstallmentRequestDto requestDto) {
		Optional<AgreementWithResearcher> byId = agreementWithResearcherRepository
				.findById(requestDto.getAgreementId());
		requestDto.setAgreementWithResearcherId(byId.get());
		return create(requestDto);
	}

	@Override
	public BooleanValueHolderDTO updateAgreementInstallment(AgreementInstallmentRequestDto requestDto) {		
		
		BooleanValueHolderDTO holderDTO = new BooleanValueHolderDTO();
		// retrieving info data
		Optional<AgreementWithResearcher> byId = agreementWithResearcherRepository
				.findById(requestDto.getAgreementId());
		requestDto.setAgreementWithResearcherId(byId.get());

		// retrieving own data
		AgreementInstallment installment = agreementInstallmentRepository.findById(requestDto.getId()).get();

		AgreementInstallment newAgreementObj = new AgreementInstallment();
		BeanUtils.copyProperties(requestDto, newAgreementObj);

		newAgreementObj.setIsDeleted(installment.getIsDeleted());
		newAgreementObj.setCreatedBy(installment.getCreatedBy());
		newAgreementObj.setCreatedOn(installment.getCreatedOn());
		try {
			AgreementInstallment save = agreementInstallmentRepository.save(newAgreementObj);
			holderDTO.setSuccess(true);
			holderDTO.setMessage("Update Success");

		} catch (Exception e) {
			holderDTO.setSuccess(false);
			holderDTO.setMessage("Update failed");

		}
		return holderDTO;
	}

	@Override
	protected List<AgreementInstallmentResponseDto> convertForRead(List<AgreementInstallment> e) {

		List<AgreementInstallmentResponseDto> list = super.convertForRead(e);
		if (list.isEmpty()) {
			return list;
		}

		Map<Long, InstallmentTypeResponseDto> installmentTypeTypeResponseDtoMap = rmsConfigurationClientService
				.getInstallmentType(new IdSetRequestBodyDTO() {
					{
						setIds(list.stream().map(AgreementInstallmentResponseDto::getStInstallmentTypeId)
								.collect(Collectors.toSet()));
					}
				}).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));

		return list.stream().peek(p -> {
			p.setInstallmentTypeResponseDto(installmentTypeTypeResponseDtoMap.get(p.getStInstallmentTypeId()));
		}).collect(Collectors.toList());
	}

	@Override
	public Response<AgreementInstallmentResponseDto> findAllByAgreementWithResearcherId(
			Long agreementWithResearcherId) {
		Optional<AgreementWithResearcher> optional = agreementWithResearcherRepository
				.findByIdAndIsDeleted(agreementWithResearcherId, false);

		if (!optional.isPresent()) {
			return getErrorResponse("Agreement With Researcher Not Found!.");
		}

		List<AgreementInstallment> responseList = agreementInstallmentRepository
				.findAllByAgreementWithResearcherId(optional.get());

		if (responseList != null && responseList.size() > 0) {
			return new Response<AgreementInstallmentResponseDto>() {
				{
					setSuccess(true);
					setMessage("Data Found !.");
					setItems(convertForRead(responseList));
				}
			};
		}

		return getErrorResponse("Data not found !.");
	}

}
