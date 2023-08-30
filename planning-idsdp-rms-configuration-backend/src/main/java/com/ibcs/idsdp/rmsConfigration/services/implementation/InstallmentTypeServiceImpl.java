package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.InstallmentType;
import com.ibcs.idsdp.rmsConfigration.model.repositories.InstallmentTypeRepository;
import com.ibcs.idsdp.rmsConfigration.services.InstallmentTypeService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.InstallmentTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.InstallmentTypeResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;


@Service
@Transactional

public class InstallmentTypeServiceImpl extends BaseService<InstallmentType, InstallmentTypeRequestDto, InstallmentTypeResponseDto> implements InstallmentTypeService {

    private final InstallmentTypeRepository installmentTypeRepository;

    public InstallmentTypeServiceImpl(ServiceRepository<InstallmentType> repository, InstallmentTypeRepository installmentTypeRepository) {
        super(repository);
        this.installmentTypeRepository = installmentTypeRepository;
    }

    @Override
    public Response<InstallmentTypeResponseDto> createInstallmentType(InstallmentTypeRequestDto installmentTypeRequestDto) {
        Boolean isExists = isExistsBeforeSave("st_installment_type", "installment_type",
                installmentTypeRequestDto.getInstallmentType());

        if (!isExists) {
            return create(installmentTypeRequestDto);
        }

        return getErrorResponse("Already Exist!.");

    }

    @Override
    public Response<InstallmentTypeResponseDto> updateInstallmentType(InstallmentTypeRequestDto installmentTypeRequestDto) {

        Boolean isExists = isExistsBeforeUpdate("st_installment_type", "installment_type",
                installmentTypeRequestDto.getId(), installmentTypeRequestDto.getInstallmentType());

        if (!isExists) {
            return update(installmentTypeRequestDto);
        }

        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<InstallmentType> findAllByActive(boolean isDeleted, boolean isActive) {
        Response<InstallmentType> response = new Response();
        List<InstallmentType> list=installmentTypeRepository.findAllByIsDeletedAndActive(isDeleted,isActive);
        if (!CollectionUtils.isEmpty(list) && list.size() > 0) {
            response.setItems(list);
            return getSuccessResponse("Data Found!", response);
        }
        return getErrorResponse("Data Not Found!");
    }
    
}
