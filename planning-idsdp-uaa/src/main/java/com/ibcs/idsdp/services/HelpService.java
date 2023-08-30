package com.ibcs.idsdp.services;

import com.ibcs.idsdp.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.model.domain.Help;
import com.ibcs.idsdp.model.repositories.HelpRepository;
import com.ibcs.idsdp.web.dto.HelpDTO;
import org.springframework.stereotype.Service;



@Service
public class HelpService extends BaseService<Help, HelpDTO>{

    private final HelpRepository helpRepository;

    protected HelpService(HelpRepository helpRepository) {
        super(helpRepository);
        this.helpRepository = helpRepository;
    }

    @Override
    public HelpDTO create(HelpDTO helpDTO) {
        validation(helpDTO);
        return super.create(helpDTO);
    }

    private void validation(HelpDTO helpDTO) {
        if (isNull(helpDTO.getFirstName()) || isNull(helpDTO.getLastName()) || isNull(helpDTO.getEmail()) || isNull(helpDTO.getMessage())) {
            throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException("Please fill all required field!");
        }
    }

    private boolean isNull(Object object) {
        if (object == null || object.equals("")) return true;
        return false;
    }
}
