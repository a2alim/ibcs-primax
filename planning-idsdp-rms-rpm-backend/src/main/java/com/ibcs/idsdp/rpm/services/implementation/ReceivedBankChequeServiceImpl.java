package com.ibcs.idsdp.rpm.services.implementation;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import com.ibcs.idsdp.rpm.model.domain.ReceivedBankChequeUploadDoc;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.ReceivedBankCheque;
import com.ibcs.idsdp.rpm.model.repositories.ReceivedBankChequeRepository;
import com.ibcs.idsdp.rpm.services.CreateGOLetterService;
import com.ibcs.idsdp.rpm.services.ReceivedBankChequeService;
import com.ibcs.idsdp.rpm.services.ReceivedBankChequeUploadDocService;
import com.ibcs.idsdp.rpm.web.dto.request.ReceivedBankChequeRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateGOLetterResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ReceivedBankChequeResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ReceivedBankChequeUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class ReceivedBankChequeServiceImpl extends BaseService<ReceivedBankCheque, ReceivedBankChequeRequestDto, ReceivedBankChequeResponseDto> implements ReceivedBankChequeService{

	private final IdGeneratorComponent idGeneratorComponent;
	private final ReceivedBankChequeRepository receivedBankChequeRepository;
	private final CreateGOLetterService createGOLetterService;
	private final ReceivedBankChequeUploadDocService receivedBankChequeUploadDocService;
	
	protected ReceivedBankChequeServiceImpl(ServiceRepository<ReceivedBankCheque> repository,
			IdGeneratorComponent idGeneratorComponent,
			ReceivedBankChequeRepository receivedBankChequeRepository,
			CreateGOLetterService createGOLetterService,
			ReceivedBankChequeUploadDocService receivedBankChequeUploadDocService) {
		super(repository);
		this.idGeneratorComponent = idGeneratorComponent;
		this.receivedBankChequeRepository = receivedBankChequeRepository;
		this.createGOLetterService = createGOLetterService;
		this.receivedBankChequeUploadDocService = receivedBankChequeUploadDocService;
	}

	@Override
	public Response<ReceivedBankChequeResponseDto> save(ReceivedBankChequeRequestDto receivedBankChequeRequestDto) {
		Response<ReceivedBankChequeResponseDto> response = new Response<>();
		ReceivedBankCheque rbc = new ReceivedBankCheque();

		if(receivedBankChequeRequestDto.getId() != null) {
			Optional<ReceivedBankCheque> result = receivedBankChequeRepository.findByIdAndIsDeleted(receivedBankChequeRequestDto.getId(), false);
			if(!result.isPresent()) throw new ResourceNotFoundException("Bank Cheque Not Found");
			rbc = result.get();
		}

		BeanUtils.copyProperties(receivedBankChequeRequestDto, rbc, "id", "uuid");

		if(rbc.getGrantAmount()<rbc.getReceivedAmount()) {
			response.setSuccess(false);
			response.setMessage("Received amount should not be greater than grant amount");
			response.setObj(null);
			return response;
		}


		if(rbc.getId() == null) {
			rbc.setUuid(idGeneratorComponent.generateUUID());
		} else {
			rbc.setUpdatedBy("admin");
			rbc.setUpdatedOn(LocalDate.now());
		}

		rbc.setCreatedBy("admin");
		rbc.setCreatedOn(LocalDate.now());
		rbc.setIsDeleted(false);

		try {
			receivedBankChequeRepository.save(rbc);
		} catch (Exception e) {
			log.error("ERROR is : {}, {}", e.getMessage(), e);
			response.setSuccess(false);
			response.setMessage("Can't save Received bank cheque");
			response.setObj(null);
			return response;
		}

		ReceivedBankChequeResponseDto responseDto = new ReceivedBankChequeResponseDto();
		BeanUtils.copyProperties(rbc, responseDto);
		response.setSuccess(true);
		response.setMessage("Received Bank Cheque Saved Successfully");
		response.setObj(responseDto);
		return response;
	}

	@Override
	public Page<ReceivedBankChequeResponseDto> getAllReceivedBanlCheque(ReceivedBankChequeRequestDto receivedBankChequeRequestDto) {

		Pageable pageable = this.getPageable(receivedBankChequeRequestDto.getPageableRequestBodyDTO());
		Page<ReceivedBankCheque> ePage = null;
		if(receivedBankChequeRequestDto.getFiscalYearId() != null) {
			if(receivedBankChequeRequestDto.getResearcherProposalId() == null && receivedBankChequeRequestDto.getResearchCatTypeId() == null) {
				ePage = receivedBankChequeRepository.findAllByIsDeletedAndFiscalYearId(false, receivedBankChequeRequestDto.getFiscalYearId(), pageable);
			} else if (receivedBankChequeRequestDto.getResearcherProposalId() != null && receivedBankChequeRequestDto.getResearchCatTypeId() == null) {
				ePage = receivedBankChequeRepository.findAllByIsDeletedAndFiscalYearIdAndResearcherProposalId(false, receivedBankChequeRequestDto.getFiscalYearId(), receivedBankChequeRequestDto.getResearcherProposalId(), pageable);
			} else if (receivedBankChequeRequestDto.getResearcherProposalId() == null && receivedBankChequeRequestDto.getResearchCatTypeId() != null) {
				ePage = receivedBankChequeRepository.findAllByIsDeletedAndFiscalYearIdAndResearchCatTypeId(false, receivedBankChequeRequestDto.getFiscalYearId(), receivedBankChequeRequestDto.getResearchCatTypeId(), pageable);
			} else {
				ePage = receivedBankChequeRepository.findAllByIsDeletedAndFiscalYearIdAndResearcherProposalIdAndResearchCatTypeId(false, receivedBankChequeRequestDto.getFiscalYearId(), receivedBankChequeRequestDto.getResearcherProposalId(), receivedBankChequeRequestDto.getResearchCatTypeId(), pageable);
			}
		} else {
			ePage = receivedBankChequeRepository.findAllByIsDeleted(false, pageable);
		}

		List<ReceivedBankChequeResponseDto> list = convertForRead(ePage.getContent());

		for(ReceivedBankChequeResponseDto dto : list) {
			Response<CreateGOLetterResponseDto> godto = createGOLetterService.findById(dto.getCreateGoLetterId());
			if(godto != null) {
				dto.setCreateGOLetter(godto.getObj());
			}

			Response<ReceivedBankChequeUploadDocResponseDto> files = receivedBankChequeUploadDocService.findAllByReceivedBankChequeId(dto.getId());
			if(files != null && files.getItems() != null && !files.getItems().isEmpty()) {
				List<ReceivedBankChequeUploadDocResponseDto> resfile = files.getItems();
				dto.setReceivedBankChequeUploadDoc(resfile);
			}

		}

		list.sort(Comparator.comparing(ReceivedBankChequeResponseDto::getId).reversed());

		return new PageImpl<>(list, pageable, ePage.getTotalElements());
	}

	@Override
	public Response<ReceivedBankChequeResponseDto> deleteByid(Long id) {
		Response<ReceivedBankChequeResponseDto> response = new Response<>();
		
		try {
			Optional<ReceivedBankCheque> result = receivedBankChequeRepository.findByIdAndIsDeleted(id, false);
			if(!result.isPresent()) throw new ResourceNotFoundException("Received Bank Cheque Not Found");
			
			ReceivedBankCheque rbc = result.get();
			rbc.setIsDeleted(true);
			rbc.setUpdatedBy("admin");
			rbc.setUpdatedOn(LocalDate.now());
			receivedBankChequeRepository.save(rbc);
			
			ReceivedBankChequeResponseDto responseDto = new ReceivedBankChequeResponseDto();
			BeanUtils.copyProperties(rbc, responseDto);
			response.setSuccess(true);
			response.setMessage("Received Bank Cheque Deleted Successfully");
			response.setObj(responseDto);
			return response;
			
		} catch (Exception e) {
			log.error("ERROR is : {}, {}", e.getMessage(), e);
			response.setSuccess(false);
			response.setMessage("Can't delete Received bank cheque");
			response.setObj(null);
			return response;
		}
	}

	
}
