package com.ibcs.idsdp.services;

import com.ibcs.idsdp.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.model.domain.Faq;
import com.ibcs.idsdp.model.domain.ImsModule;
import com.ibcs.idsdp.model.repositories.FaqRepository;
import com.ibcs.idsdp.web.dto.FaqDTO;
import com.ibcs.idsdp.web.dto.request.ImsSearchDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class FaqService extends BaseService<Faq, FaqDTO>{

    private final FaqRepository faqRepository;

    protected FaqService(FaqRepository faqRepository) {
        super(faqRepository);
        this.faqRepository = faqRepository;
    }

    public List<FaqDTO> searchByQuestion(ImsSearchDTO searchDTO) {
        if (searchDTO.getSearchText() == null) searchDTO.setSearchText("");
        if (searchDTO.getImsModuleId() == null || searchDTO.getImsModuleId().equals("")) {
            return convertForRead(faqRepository.findAllByQuestionContainingIgnoreCaseAndIsActiveAndIsDeletedOrderById(searchDTO.getSearchText(),true,false));
        } else {
            return convertForRead(faqRepository.findAllByQuestionContainingIgnoreCaseAndImsModuleIdAndIsActiveAndIsDeletedOrderById(searchDTO.getSearchText(), searchDTO.getImsModuleId(),true,false));
        }
    }

    @Override
    public FaqDTO create(FaqDTO faqDTO) {
        validation(faqDTO);
        return super.create(faqDTO);
    }

    @Override
    public FaqDTO update(FaqDTO faqDTO) {
        validation(faqDTO);
        return super.update(faqDTO);
    }

    private void validation(FaqDTO faqDTO) {
        if (isNull(faqDTO.getQuestion()) || isNull(faqDTO.getAnswer())) {
            throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException("Please fill all required field!");
        }
    }

    private boolean isNull(Object object) {
        if (object == null || object.equals("")) return true;
        return false;
    }

    public Page<Faq> getModulListByPageable(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Faq> pageResult = faqRepository.findAllByIsActiveAndIsDeleted(true,false, pageRequest);
        return new PageImpl<>(pageResult.getContent(), pageRequest, pageResult.getTotalElements());
    }


}
