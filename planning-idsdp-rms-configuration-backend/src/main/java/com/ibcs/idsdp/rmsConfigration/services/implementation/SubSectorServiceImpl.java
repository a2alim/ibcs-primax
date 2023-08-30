package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.rmsConfigration.model.repositories.SubSectorRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.SubSector;
import com.ibcs.idsdp.rmsConfigration.services.SubSectorService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.SubSectorRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.SubSectorResponseDto;
import com.ibcs.idsdp.util.Response;

import java.math.BigInteger;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional
public class SubSectorServiceImpl extends BaseService<SubSector, SubSectorRequestDto, SubSectorResponseDto>
		implements SubSectorService {

	@Autowired
	private EntityManagerFactory entityManagerFactory;

	private final SubSectorRepository subSectorRepository;

	protected SubSectorServiceImpl(ServiceRepository<SubSector> repository, SubSectorRepository subSectorRepository) {
		super(repository);
		this.subSectorRepository = subSectorRepository;
	}

	@Override
	public Response<SubSectorResponseDto> createSubSector(SubSectorRequestDto subSectorRequestDto) {

		Boolean isExists = isExistsBeforeSaveSubSector(subSectorRequestDto.getSectorTypeId().getId(),subSectorRequestDto.getSubFieldName());

		if (!isExists) {
			return create(subSectorRequestDto);
		}

		return getErrorResponse("Already Exist!.");
	}

	@Override
	public Response<SubSectorResponseDto> updateSubSector(SubSectorRequestDto subSectorRequestDto) {

		Boolean isExists = isExistsBeforeUpdateSubSector(subSectorRequestDto.getSectorTypeId().getId(),subSectorRequestDto.getSubFieldName(),subSectorRequestDto.getId());

		if (!isExists) {
			return update(subSectorRequestDto);
		}

		return getErrorResponse("Already Exist!.");
	}

	@Override
	public Response<SubSectorResponseDto> findBySectorId(Long sectorId) {
		List<SubSector> subSectorList =  subSectorRepository.findBysectorTypeIdIdAndIsDeleted(sectorId,false);
		List<SubSectorResponseDto> subSectorResponseDtoList = new ArrayList<>();

		subSectorList.forEach(subSector -> {
			SubSectorResponseDto subSectorResponseDto = new SubSectorResponseDto();
			ModelMapper modelMapper = new ModelMapper();
			modelMapper.map(subSector, subSectorResponseDto);
			subSectorResponseDtoList.add(subSectorResponseDto);
		});
		Response<SubSectorResponseDto> subSectorResponseDtoResponse = new Response<SubSectorResponseDto>();
		subSectorResponseDtoResponse.setSuccess(true);
		subSectorResponseDtoResponse.setItems(subSectorResponseDtoList);
		return subSectorResponseDtoResponse;
	}

	// =============== For Duplicate Check ===================
	public Boolean isExistsBeforeSaveSubSector(Long sectorTypeId, String subFieldName) {

		String query = "SELECT COUNT(*) FROM st_sub_sectors WHERE st_sub_sectors.st_sector_type_id = '" + sectorTypeId + "' AND st_sub_sectors.sub_field_name = '" + subFieldName + "' AND is_deleted=false";
		
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		Query nativeQuery = entityManager.createNativeQuery(query);
		BigInteger result = (BigInteger) nativeQuery.getSingleResult();

		if (result != null && result == BigInteger.ZERO) {
			return false;
		}

		System.out.println("result Before SubSector ==== > " + result);
		return true;
	}

	public Boolean isExistsBeforeUpdateSubSector(Long sectorTypeId, String subFieldName, Long id) {

		String query = "SELECT COUNT(*) FROM st_sub_sectors WHERE st_sub_sectors.st_sector_type_id = " + sectorTypeId + " AND st_sub_sectors.sub_field_name = '" + subFieldName + "' and id <> " + id + " AND is_deleted=false";
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		Query nativeQuery = entityManager.createNativeQuery(query);
		BigInteger result = (BigInteger) nativeQuery.getSingleResult();

		if (result != null && result == BigInteger.ZERO) {
			return false;
		}

		System.out.println("result Before SubSector==== > " + result);
		return true;
	}

	@Override
	public Response<SubSector> findAllByActive(boolean isDeleted, boolean isActive) {
		
		
		Response<SubSector> response = new Response();
		List<SubSector> list =  subSectorRepository.findAllByIsDeletedAndActive(isDeleted,isActive);
		if (!CollectionUtils.isEmpty(list) && list.size() > 0) {
			response.setItems(list);
			return getSuccessResponse("Data Found!", response);
		}
		return getErrorResponse("Data Not Found!");	
		
	}

	@Override
	public Response<SubSectorResponseDto> getSubSectorById(Long id){
		Optional<SubSector> subSector = subSectorRepository.findByIdAndIsDeleted(id, false);
		Response<SubSectorResponseDto> dto = new Response<SubSectorResponseDto>();
		if(subSector.isPresent())
		{
			dto.setSuccess(true);
			dto.setObj(convertForRead(subSector.get()));
			return dto;
		}
		dto.setSuccess(false);
		return dto;

	}

}
