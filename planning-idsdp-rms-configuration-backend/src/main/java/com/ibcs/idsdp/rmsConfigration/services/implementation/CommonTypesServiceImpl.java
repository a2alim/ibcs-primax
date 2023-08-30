package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommonTypes;
import com.ibcs.idsdp.rmsConfigration.model.repositories.CommonTypesRepository;
import com.ibcs.idsdp.rmsConfigration.services.CommonTypesService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CommonTypesRequestDTO;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CommonTypesResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CommonTypesServiceImpl extends BaseService<CommonTypes, CommonTypesRequestDTO, CommonTypesResponseDto> implements CommonTypesService {

    private final CommonTypesRepository commonTypesRepository;

    public CommonTypesServiceImpl(ServiceRepository<CommonTypes> repository, CommonTypesRepository commonTypesRepository) {
        super(repository);
        this.commonTypesRepository = commonTypesRepository;
    }

    @Override
    public Response<CommonTypesResponseDto> createCommonType(CommonTypesRequestDTO commonTypesRequestDTO) {

        long countVal = commonTypesRepository.countByTypeNameAndForTypeAndIsDeleted(commonTypesRequestDTO.getTypeName(), commonTypesRequestDTO.getForType(), false);
        if (countVal < 1) {
            return create(commonTypesRequestDTO);
        }
        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<CommonTypesResponseDto> updateCommonType(CommonTypesRequestDTO commonTypesRequestDTO) {
        Optional<CommonTypes> val = commonTypesRepository.findByTypeNameAndForTypeAndIsDeleted(commonTypesRequestDTO.getTypeName(), commonTypesRequestDTO.getForType(), false);
        if (!val.isPresent() || commonTypesRequestDTO.getUuid().equals(val.get().getUuid())) {
            return update(commonTypesRequestDTO);
        }

        return getErrorResponse("Already Exist!.");
    }

    @Override
    public ResponseEntity<List<CommonTypes>> findAllByActiveData(Integer typeNo) {
        return new ResponseEntity(commonTypesRepository.findByTypeNoAndIsDeleted(typeNo, false), HttpStatus.OK);
    }
}
