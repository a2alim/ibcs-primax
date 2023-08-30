package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.UserSerialization;
import com.ibcs.idsdp.rmsConfigration.model.repositories.UserSerializationRepository;
import com.ibcs.idsdp.rmsConfigration.services.UserSerializationService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.UserSerializationRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.UserSerializationResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.transaction.Transactional;
import java.util.List;


@Service
@Transactional
public class UserSerializationServiceImpl extends BaseService<UserSerialization, UserSerializationRequestDto, UserSerializationResponseDto> implements UserSerializationService {

    private UserSerializationRepository userSerializationRepository;

    public UserSerializationServiceImpl(ServiceRepository<UserSerialization> repository, UserSerializationRepository userSerializationRepository) {
        super(repository);
        this.userSerializationRepository = userSerializationRepository;
    }

    @Override
    public Response<UserSerializationResponseDto> createUserSerialization(UserSerializationRequestDto userSerializationRequestDto) {
        List<UserSerialization> userSerialization = userSerializationRepository.findUnique(userSerializationRequestDto.getUserId(), userSerializationRequestDto.getSerial());
        if (userSerialization.size()==0) {
            return create(userSerializationRequestDto);
        }
        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<UserSerializationResponseDto> updateUserSerialization(UserSerializationRequestDto userSerializationRequestDto) {
        List<UserSerialization> userSerialization = userSerializationRepository.findUniqueforupdate(userSerializationRequestDto.getUserId(), userSerializationRequestDto.getSerial(),userSerializationRequestDto.getId());
        if (userSerialization.size()==0) {

            return update(userSerializationRequestDto);
        }

        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<UserSerialization> findAllByIsActive(boolean isDeleted, boolean isActive) {

        Response<UserSerialization> response = new Response();
        List<UserSerialization> list = userSerializationRepository.findAllByIsDeletedAndIsActive(isDeleted, isActive);
        if (!CollectionUtils.isEmpty(list) && list.size() > 0) {
            response.setItems(list);
            return getSuccessResponse("Data Found!", response);
        }
        return getErrorResponse("Data Not Found!");
    }
}
