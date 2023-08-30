package com.ibcs.idsdp.services;

import com.ibcs.idsdp.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.model.domain.ImsModule;
import com.ibcs.idsdp.model.repositories.*;
import com.ibcs.idsdp.web.dto.ImsModuleDTO;
import com.ibcs.idsdp.web.dto.request.SearchWithPageableRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ImsModuleService extends BaseService<ImsModule, ImsModuleDTO>{

    private final ImsModuleRepository imsModuleRepository;
    private final ImageUploadService imageUploadService;

    protected ImsModuleService(ImsModuleRepository imsModuleRepository, ImageUploadService imageUploadService) {
        super(imsModuleRepository);
        this.imsModuleRepository = imsModuleRepository;
        this.imageUploadService = imageUploadService;
    }

    public List<ImsModuleDTO> getActiveList() {
        return convertForRead(imsModuleRepository.findAllByIsActiveAndIsDeletedOrderByIdAsc(true, false));
    }

    public List<ImsModuleDTO> getDevelopmentModuleList() {
        return convertForRead(imsModuleRepository.findAllByIsDevelopmentModuleAndIsActiveAndIsDeletedOrderByIdAsc(true,true, false));
    }

    public Page<ImsModule> findAllByIsDeleteAndIsActive(int page, int size){
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<ImsModule> pageResult = imsModuleRepository.findAllByIsDeletedAndIsActive(false, true, pageRequest);
        return new PageImpl<>(pageResult.getContent(), pageRequest, pageResult.getTotalElements());
    }

    public Page<ImsModule> findAllByPageable(SearchWithPageableRequest request){
        PageRequest pageRequest = PageRequest.of(request.getPage(), request.getSize());
        Page<ImsModule> pageResult =  imsModuleRepository.findAllByPageable(false, true, request.getValue().toLowerCase(), pageRequest);
        return new PageImpl<>(pageResult.getContent(), pageRequest, pageResult.getTotalElements());
    }

    @Override
    public ImsModuleDTO create(ImsModuleDTO imsModuleDTO) {
        validation(imsModuleDTO);
        return super.create(imsModuleDTO);
    }

    @Override
    public ImsModuleDTO update(ImsModuleDTO imsModuleDTO) {
        validation(imsModuleDTO);
        return super.update(imsModuleDTO);
    }

    private void validation(ImsModuleDTO imsModuleDTO) {
        if (isNull(imsModuleDTO.getModuleName()) || isNull(imsModuleDTO.getModuleFullName()) || isNull(imsModuleDTO.getIsDevelopmentModule())) {
            throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException("Please fill all required field!");
        }
    }

    private boolean isNull(Object object) {
        if (object == null || object.equals("")) return true;
        return false;
    }

}
