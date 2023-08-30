package com.ibcs.idsdp.trainninginstitute.services.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.trainninginstitute.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.trainninginstitute.model.domain.GoLetter;
import com.ibcs.idsdp.trainninginstitute.model.domain.PartialFinalPaymentNewModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.PaymentBillVoucherNewModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingBudgetModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.PartialFinalPaymentNewRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.PaymentBillVoucherNewRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainingBudgetRepository;
import com.ibcs.idsdp.trainninginstitute.services.PaymentBillVoucherNewService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.GoLetterRequstDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.PaymentBillVoucherNewRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PartialFinalPaymentNewResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaymentBillVoucherNewResponseDto;
import com.ibcs.idsdp.util.Response;

@Service
public class PaymentBillVoucherNewServiceImpl extends BaseService<PaymentBillVoucherNewModel, PaymentBillVoucherNewRequestDto, PaymentBillVoucherNewResponseDto> implements PaymentBillVoucherNewService{

	private final PaymentBillVoucherNewRepository billVoucherNewRepository;
	private final PartialFinalPaymentNewServiceImpl partialFinalPaymentNewServiceImpl;
	private final PartialFinalPaymentNewRepository partialFinalPaymentNewRepository;	
	private final TrainingBudgetRepository trainingBudgetRepository;
	private final MinioServerService minioServerService;
	
	
	protected PaymentBillVoucherNewServiceImpl(ServiceRepository<PaymentBillVoucherNewModel> repository, PaymentBillVoucherNewRepository billVoucherNewRepository, PartialFinalPaymentNewServiceImpl partialFinalPaymentNewServiceImpl, PartialFinalPaymentNewRepository partialFinalPaymentNewRepository, TrainingBudgetRepository trainingBudgetRepository, MinioServerService minioServerService) {
		super(repository);	
		this.billVoucherNewRepository = billVoucherNewRepository;
		this.partialFinalPaymentNewServiceImpl = partialFinalPaymentNewServiceImpl;
		this.partialFinalPaymentNewRepository = partialFinalPaymentNewRepository;
		this.trainingBudgetRepository = trainingBudgetRepository;
		this.minioServerService = minioServerService;
	}
	
	
	@Override
	protected PaymentBillVoucherNewModel convertForCreate(PaymentBillVoucherNewRequestDto paymentBillVoucherNewRequestDto) {
		PaymentBillVoucherNewModel entity = super.convertForCreate(paymentBillVoucherNewRequestDto);
		Optional<PartialFinalPaymentNewModel> optional1 = partialFinalPaymentNewRepository.findByIdAndIsDeleted(paymentBillVoucherNewRequestDto.getPartialFinalPaymentId(), false);
		if (optional1.isEmpty()) {			
			throw new ServiceExceptionHolder.InvalidRequestException("Partial Final Payment not found");
		}
		Optional<TrainingBudgetModel> optional2 =  trainingBudgetRepository.findByIdAndIsDeleted(paymentBillVoucherNewRequestDto.getTrainingBudgetId(), false);
		if (optional2.isEmpty()) {			
			throw new ServiceExceptionHolder.InvalidRequestException("Training Budget not found");
		}
		entity.setPartialFinalPayment(optional1.get());
		entity.setTrainingBudgetModel(optional2.get());
		return entity;
	}

	@Override
	protected void convertForUpdate(PaymentBillVoucherNewRequestDto dto, PaymentBillVoucherNewModel entity) {
		Optional<PartialFinalPaymentNewModel> optional1 = partialFinalPaymentNewRepository.findByIdAndIsDeleted(dto.getPartialFinalPaymentId(), false);
		if (optional1.isEmpty()) {			
			throw new ServiceExceptionHolder.InvalidRequestException("Partial Final Payment not found");
		}
		Optional<TrainingBudgetModel> optional2 =  trainingBudgetRepository.findByIdAndIsDeleted(dto.getTrainingBudgetId(), false);
		if (optional2.isEmpty()) {			
			  throw new ServiceExceptionHolder.InvalidRequestException("Training Budget not found");
		}
		entity.setPartialFinalPayment(optional1.get());
		entity.setTrainingBudgetModel(optional2.get());		
		super.convertForUpdate(dto, entity);
	}

	@Override
	protected PaymentBillVoucherNewResponseDto convertForRead(PaymentBillVoucherNewModel paymentBillVoucherNewModel) {
		PaymentBillVoucherNewResponseDto dto = super.convertForRead(paymentBillVoucherNewModel);
		dto.setPartialFinalPaymentNewRequestDto(new ModelMapper().map(paymentBillVoucherNewModel.getPartialFinalPayment(), PartialFinalPaymentNewResponseDto.class));
		dto.setTrainingBudgetModel(new ModelMapper().map(paymentBillVoucherNewModel.getTrainingBudgetModel(), TrainingBudgetModel.class));
		return dto;
	}

	@Override
	public Response<PaymentBillVoucherNewResponseDto> getListFindByPartialFinalPaymentId(Long partialFinalPaymentId) {
		
		List<PaymentBillVoucherNewModel> list = billVoucherNewRepository.findAllByPartialFinalPaymentAndIsDeleted(new PartialFinalPaymentNewModel() {{setId(partialFinalPaymentId);}} ,false);

		if (list.isEmpty()) {
			return new Response<>() {{
				setSuccess(false);
				setMessage("Data Not Found");
				setObj(null);
			}};
		}
		return new Response<>() {{
			setMessage("Data Found");
			setItems(convertForRead(list));
		}};
	}

	@Transactional
	@Override
	public Response<PaymentBillVoucherNewResponseDto> createList(List<PaymentBillVoucherNewRequestDto> requestDtoList) {

		
			List<PaymentBillVoucherNewResponseDto> list = new ArrayList<>();
			try {
			requestDtoList.forEach(e -> {
				if (e.getUuid() != null) {					
					list.add(new ModelMapper().map(update(e).getObj(), PaymentBillVoucherNewResponseDto.class));
					
				} else {
					list.add(new ModelMapper().map(create(e).getObj(), PaymentBillVoucherNewResponseDto.class));
				}
			});
			
			return new Response<>() {{
				setSuccess(true);
				setItems(list);
				setMessage("Save Successfully !.");
			}};

			} catch (Exception e) {
				return getErrorResponse("Save Failed!");
			}
				
	}
	
	
	@Override
	public Response<PaymentBillVoucherNewResponseDto> uploadDocument(String data, Optional<MultipartFile> file) {

		PaymentBillVoucherNewRequestDto requestDto = objectMapperReadValue(data, PaymentBillVoucherNewRequestDto.class);
		FileUploadResponse fileUploadResponse = new FileUploadResponse();

		Optional<PaymentBillVoucherNewModel> optional = billVoucherNewRepository.findByIdAndIsDeleted(requestDto.getId(), false);
		if (!optional.isPresent()) {
			return getErrorResponse("Bill Voucher Not Found !.");
		}

		if (!file.isPresent() && optional.get().getFileDownloadUrl() == null) {
			return getErrorResponse("File Not Found !.");
		}

		if (file.isPresent() && optional.get().getFileDownloadUrl() == null) {
			fileUploadResponse = minioServerService.getFileDownloadUrl(file.get(), "rms");
		}

		if (file.isPresent() && optional.get().getFileDownloadUrl() != null) {
			minioServerService.setFileDownloadUrlDeleteFile(optional.get().getBucketName(),	optional.get().getFileName());
			fileUploadResponse = minioServerService.getFileDownloadUrl(file.get(), "rms");
		}

		if (fileUploadResponse == null && optional.get().getFileDownloadUrl() == null) {
			return getErrorResponse("File not save !.");
		}

		requestDto.setFileDownloadUrl(fileUploadResponse.getDownloadUrl() != null ? fileUploadResponse.getDownloadUrl()
				: optional.get().getFileDownloadUrl());
		requestDto.setBucketName(fileUploadResponse.getBucketName() != null ? fileUploadResponse.getBucketName()
				: optional.get().getBucketName());
		requestDto.setFileName(fileUploadResponse.getFileName() != null ? fileUploadResponse.getFileName()
				: optional.get().getFileName());

		return update(requestDto);

	}

}
