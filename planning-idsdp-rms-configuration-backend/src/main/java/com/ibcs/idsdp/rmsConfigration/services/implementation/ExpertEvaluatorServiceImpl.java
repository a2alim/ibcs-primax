package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.rmsConfigration.model.domain.ExpertEvaluator;
import com.ibcs.idsdp.rmsConfigration.model.domain.ExpertEvaluatorSectorSubSector;
import com.ibcs.idsdp.rmsConfigration.model.repositories.ExpertEvaluatorEducationRepository;
import com.ibcs.idsdp.rmsConfigration.model.repositories.ExpertEvaluatorRepository;
import com.ibcs.idsdp.rmsConfigration.model.repositories.ExpertEvaluatorSsrcRepository;
import com.ibcs.idsdp.rmsConfigration.model.repositories.ExpertEvaluatorSubSectorRepository;
import com.ibcs.idsdp.rmsConfigration.services.ExpertEvaluatorService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ExpertEvaluatorRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ExpertEvaluatorSectorSubSectorRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ExamEvaluatorResponse;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.util.CommonFunctions;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.dom4j.rule.Mode;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
@Transactional
public class ExpertEvaluatorServiceImpl implements ExpertEvaluatorService, CommonFunctions {

	@Autowired
	private IdGeneratorComponent idGeneratorComponent;

	private final ExpertEvaluatorRepository expertEvaluatorRepository;
	private final ExpertEvaluatorEducationRepository expertEvaluatorEducationRepository;
	private final ExpertEvaluatorSsrcRepository expertEvaluatorSsrcRepository;
	private final ExpertEvaluatorSubSectorRepository expertEvaluatorSubSectorRepository;

	@Override
	public Response create(ExpertEvaluatorRequestDto expertEvaluatorRequestDto) {
		ExpertEvaluator expertEvaluator = convertToEntity(new ExpertEvaluator(), expertEvaluatorRequestDto);
		expertEvaluator.setIsDeleted(false);
		expertEvaluator.setCreatedBy("user");
		expertEvaluator.setIsDeleted(false);
		expertEvaluator.setCreatedOn(LocalDate.now());
		expertEvaluator.setUuid(idGeneratorComponent.generateUUID());
		expertEvaluatorRepository.save(expertEvaluator);

		ExpertEvaluatorResponseDto expertEvaluatorResponseDto = new ExpertEvaluatorResponseDto();
		BeanUtils.copyProperties(expertEvaluator, expertEvaluatorResponseDto);
		Response<ExpertEvaluatorResponseDto> response = new Response();
		response.setObj(expertEvaluatorResponseDto);
		response.setMessage("Saved Successfully");
		response.setSuccess(true);
		return response;
	}

	public ExpertEvaluator convertToEntity(ExpertEvaluator target,
			ExpertEvaluatorRequestDto expertEvaluatorRequestDto) {
		ExpertEvaluator expertEvaluator = target;
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.map(expertEvaluatorRequestDto, expertEvaluator);
//		expertEvaluator.setSectorSubSectors(expertEvaluatorRequestDto.getSectorSubSectors().stream().map(res -> {
//			ExpertEvaluatorSectorSubSector expertEvaluatorSectorSubSector = new ExpertEvaluatorSectorSubSector();
////			expertEvaluatorSectorSubSector.setStSectorTypeId(res.getStSectorTypeId());
////			expertEvaluatorSectorSubSector.setStSubSectorsIds(res.getStSubSectorsIds());
//			expertEvaluatorSectorSubSector.setSector(res.getSector());
//			expertEvaluatorSectorSubSector.setSubSector(res.getSubSector());
//			return expertEvaluatorSectorSubSector;
//		}).collect(Collectors.toList()));

		expertEvaluator.setSectorSubSectors(expertEvaluatorRequestDto.getSectorSubSectors().stream()
				.map(c -> new ExpertEvaluatorSectorSubSector(c.getSector(), c.getSubSector())).collect(Collectors.toList()));
		return expertEvaluator;
	}


	public ExpertEvaluator convertToEntityForUpdate(ExpertEvaluator target,
			ExpertEvaluatorRequestDto expertEvaluatorRequestDto) {

		ExpertEvaluator expertEvaluator = target;
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.map(expertEvaluatorRequestDto, expertEvaluator);

		expertEvaluator.setSectorSubSectors(expertEvaluatorRequestDto.getSectorSubSectors().stream().map(res -> {
			ExpertEvaluatorSectorSubSector expertEvaluatorSectorSubSector = new ExpertEvaluatorSectorSubSector();
			expertEvaluatorSectorSubSector.setSector(res.getSector());
			expertEvaluatorSectorSubSector.setSubSector(res.getSubSector());
			return expertEvaluatorSectorSubSector;
		}).collect(Collectors.toList()));

		return expertEvaluator;
	}

	@Override
	public Response findById(Long id) {

		Optional<ExpertEvaluator> expertEvaluator;
		AccessTokenDetail tokenDetails = getTokenDetails();

		if(!StringUtils.isEmpty(tokenDetails.getUserType()) && tokenDetails.getUserType().equals("Rms_DO")){
			expertEvaluator = expertEvaluatorRepository.findById(id);
		}else{
			expertEvaluator = expertEvaluatorRepository.findByUserIdAndIsDeleted(Long.parseLong(tokenDetails.getId()), false);
		}

		Response<ExpertEvaluator> response = new Response();
		if (!expertEvaluator.isEmpty()) {
			response.setObj(expertEvaluator.get());
			response.setMessage("Data Found Successfully!");
			response.setSuccess(true);
		} else {
			response.setMessage("Data Not Found!");
			response.setSuccess(false);
		}
		return response;
	}

	@Override
	public Response update(ExpertEvaluatorRequestDto expertEvaluatorRequestDto, long id) {
		ExpertEvaluator expertEvaluator = convertToEntityForUpdate(expertEvaluatorRepository.findById(id).get(),
				expertEvaluatorRequestDto);
		expertEvaluator.setId(id);
		expertEvaluatorRepository.save(expertEvaluator);

//        ExpertEvaluatorResponseDto expertEvaluatorResponseDto = new ExpertEvaluatorResponseDto();
//        BeanUtils.copyProperties(expertEvaluator, expertEvaluatorResponseDto);
		Response<ExpertEvaluator> response = new Response();
		response.setObj(expertEvaluator);
		response.setMessage("Saved Successfully");
		response.setSuccess(true);
		return response;
	}

	@Override
	public Response getAllExpertEvaluator() {

		List<ExpertEvaluator> expertEvaluatorList = new ArrayList<>();
		AccessTokenDetail tokenDetails = getTokenDetails();

		if(!StringUtils.isEmpty(tokenDetails.getUserType()) && tokenDetails.getUserType().equals("Rms_DO")){
			expertEvaluatorList.addAll(expertEvaluatorRepository.findAll());
		}else{
			expertEvaluatorList.add(expertEvaluatorRepository.findByUserIdAndIsDeleted(Long.parseLong(tokenDetails.getId()), false).get());
		}

//		List<ExpertEvaluator> expertEvaluatorList = expertEvaluatorRepository.findAll();
		Response<ExpertEvaluator> response = new Response();
		if (!expertEvaluatorList.isEmpty()) {
			response.setItems(expertEvaluatorList);
			response.setMessage("Data Found Successfully!");
			response.setSuccess(true);
		} else {
			response.setMessage("Data Not Found!");
			response.setSuccess(false);
		}

		return response;
	}

	@Override
	public Response deleteById(Long id) {
		Response<ExpertEvaluator> response = new Response();
		try {
			expertEvaluatorRepository.deleteById(id);
			response.setMessage("Delete Successfully!");
			response.setSuccess(true);
			return response;
		} catch (Exception ex) {
			response.setMessage("Data Not Found!");
			response.setSuccess(false);
			return response;
		}
	}

	@Override
	public Response<ExpertEvaluatorResponseDto> getByIds(Set<Long> ids) {

		Response<ExpertEvaluatorResponseDto> response = new Response();
		List<ExpertEvaluator> list = null;
		try {
			list = expertEvaluatorRepository.findAllByIdInAndIsDeleted(ids, false);

			if (list.size() > 0) {
				response.setSuccess(true);
				response.setMessage("Data Found");
				response.setItems(list.stream().map(m -> new ModelMapper().map(m, ExpertEvaluatorResponseDto.class))
						.collect(Collectors.toList()));
				return response;
			}
			response.setSuccess(true);
			response.setMessage("Data Empty");
			return response;

		} catch (Exception e) {
			response.setSuccess(false);
			response.setMessage("Data not found !!");
			return response;
		}
	}

	@Override
	public Response findByUserId(Long userId) {
		Optional<ExpertEvaluator> optioanl = expertEvaluatorRepository.findByUserIdAndIsDeleted(userId, false);
		if (optioanl.isPresent()) {
			Response response = new Response();
			response.setObj(new ModelMapper().map(optioanl.get(), ExpertEvaluatorResponseDto.class));
			response.setMessage("Data Found!.");
			response.setSuccess(true);

			return response;
		}
		return new Response() {
			{
				setMessage("Data Not Found!.");
				setSuccess(false);
				setObj(null);
			}
		};
	}

}
