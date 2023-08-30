package com.ibcs.idsdp.services;

import com.ibcs.idsdp.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.model.domain.Guideline;
import com.ibcs.idsdp.model.domain.ImsModule;
import com.ibcs.idsdp.model.repositories.GuidelineRepository;
import com.ibcs.idsdp.web.dto.GuidelineDTO;
import com.ibcs.idsdp.web.dto.request.ImsSearchDTO;
import com.ibcs.idsdp.web.dto.request.SearchWithPageableRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class GuidelineService extends BaseService<Guideline, GuidelineDTO>{

    private final GuidelineRepository guidelineRepository;

    protected GuidelineService(GuidelineRepository guidelineRepository) {
        super(guidelineRepository);
        this.guidelineRepository = guidelineRepository;
    }

    public List<GuidelineDTO> getActiveListByModuleId(ImsSearchDTO searchDTO) {
        if (searchDTO.getImsModuleId() == null || searchDTO.getImsModuleId().equals("")) {
            return convertForRead(guidelineRepository.findAllByIsActiveAndIsDeletedOrderById(true,false));
        } else {
            return convertForRead(guidelineRepository.findAllByImsModuleIdAndIsActiveAndIsDeletedOrderById(searchDTO.getImsModuleId(),true,false));
        }
    }

    public Page<Guideline> findAllByPageable(SearchWithPageableRequest request){
        PageRequest pageRequest = PageRequest.of(request.getPage(), request.getSize());
        Page<Guideline> pageResult =  guidelineRepository.findAllByPageable(false, true, request.getValue().toLowerCase(), pageRequest);
        return new PageImpl<>(pageResult.getContent(), pageRequest, pageResult.getTotalElements());
    }

    @Override
    public GuidelineDTO create(GuidelineDTO guidelineDTO) {
        validation(guidelineDTO);
        return super.create(guidelineDTO);
    }

    @Override
    public GuidelineDTO update(GuidelineDTO guidelineDTO) {
        validation(guidelineDTO);
        return super.update(guidelineDTO);
    }

    private void validation(GuidelineDTO guidelineDTO) {
        if (isNull(guidelineDTO.getImsModuleId()) || isNull(guidelineDTO.getTitle()) || isNull(guidelineDTO.getDescription())) {
            throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException("Please fill all required field!");
        }
    }

    private boolean isNull(Object object) {
        if (object == null || object.equals("")) return true;
        return false;
    }
}
