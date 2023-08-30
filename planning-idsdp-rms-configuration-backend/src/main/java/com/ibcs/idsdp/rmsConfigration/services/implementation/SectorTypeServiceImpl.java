package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.rmsConfigration.model.repositories.SectorTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.SectorType;
import com.ibcs.idsdp.rmsConfigration.services.SectorTypeService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.SectorTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.SectorTypeResponseDto;
import com.ibcs.idsdp.util.Response;

import java.math.BigInteger;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import javax.transaction.Transactional;

@Service
@Transactional
public class SectorTypeServiceImpl extends BaseService<SectorType, SectorTypeRequestDto, SectorTypeResponseDto>
		implements SectorTypeService {

	@Autowired
	private EntityManagerFactory entityManagerFactory;

	private final SectorTypeRepository sectorTypeRepository;

	protected SectorTypeServiceImpl(ServiceRepository<SectorType> repository,
			SectorTypeRepository sectorTypeRepository) {
		super(repository);
		this.sectorTypeRepository = sectorTypeRepository;
	}

	@Override
	public Response<SectorTypeResponseDto> createSectorType(SectorTypeRequestDto sectorTypeRequestDto) {

		Boolean isExists = isExistsBeforeSaveSectorType(sectorTypeRequestDto.getFieldName());

		if (!isExists) {
			return create(sectorTypeRequestDto);
		}

		return getErrorResponse("Already Exist!.");
	}

	@Override
	public Response<SectorTypeResponseDto> updateSectorType(SectorTypeRequestDto sectorTypeRequestDto) {

		Boolean isExists = isExistsBeforeUpdateSectorType(sectorTypeRequestDto.getFieldName(), sectorTypeRequestDto.getId());
		System.out.println("========================");

		if (!isExists) {
			return update(sectorTypeRequestDto);
		}

		return getErrorResponse("Already Exist!.");
	}

	@Override
	public Response<SectorType> findAllByActive(boolean isDeleted, boolean isActive) {
		Response<SectorType> response = new Response();
		List<SectorType> list = sectorTypeRepository.findAllByIsDeletedAndActive(isDeleted, isActive);
		if (!CollectionUtils.isEmpty(list) && list.size() > 0) {
			response.setItems(list);
			return getSuccessResponse("Data Found!", response);
		}
		return getErrorResponse("Data Not Found!");
	}

	// =============== For Duplicate Check ===================
	public Boolean isExistsBeforeSaveSectorType(String fieldName) {

		String query = "SELECT COUNT(*) FROM st_sector_type WHERE st_sector_type.field_name = '" + fieldName
				+ "' AND is_deleted=false";

		EntityManager entityManager = entityManagerFactory.createEntityManager();
		Query nativeQuery = entityManager.createNativeQuery(query);
		BigInteger result = (BigInteger) nativeQuery.getSingleResult();

		if (result != null && result == BigInteger.ZERO) {
			return false;
		}

		System.out.println("result Before SubSector ==== > " + result);
		return true;
	}

	public Boolean isExistsBeforeUpdateSectorType(String fieldName, Long id) {

		String query = "SELECT COUNT(*) FROM st_sector_type WHERE st_sector_type.field_name = '" + fieldName + "' and id <> " + id
				+ " AND is_deleted=false";

		EntityManager entityManager = entityManagerFactory.createEntityManager();
		Query nativeQuery = entityManager.createNativeQuery(query);
		BigInteger result = (BigInteger) nativeQuery.getSingleResult();

		if (result != null && result == BigInteger.ZERO) {
			return false;
		}

		System.out.println("result Before SubSector==== > " + result);
		return true;
	}

}
