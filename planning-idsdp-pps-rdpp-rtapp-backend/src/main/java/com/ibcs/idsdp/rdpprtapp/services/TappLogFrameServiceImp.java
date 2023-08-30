package com.ibcs.idsdp.rdpprtapp.services;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappLogFrame;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappLogFrameRepository;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappLogFrameDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
public class TappLogFrameServiceImp extends BaseService<TappLogFrame, TappLogFrameDTO> implements TappLogFrameService {

    private final TappLogFrameRepository tappLogFrameRepository;

    public TappLogFrameServiceImp(TappLogFrameRepository tappLogFrameRepository) {
        super(tappLogFrameRepository);
        this.tappLogFrameRepository = tappLogFrameRepository;
    }

    public ResponseWithResults getTappLogFrame(String pcUuid){
        Optional<TappLogFrame> optional = tappLogFrameRepository.findByPcUuid(pcUuid);
        if(!optional.isPresent()){
            return new ResponseWithResults(0, "Not Found", "");
        }else{
            TappLogFrame logFrame = optional.get();
            TappLogFrameDTO response = new TappLogFrameDTO();
            BeanUtils.copyProperties(logFrame, response);
            return new ResponseWithResults(1, "Success", response);
        }
    }

    @Override
    public TappLogFrameDTO updateTappLogFrame(TappLogFrameDTO dto, String pcUuid) {
        Optional<TappLogFrame> optional = tappLogFrameRepository.findByPcUuid(pcUuid);
            if(!optional.isPresent()){
                throw new RuntimeException("Not Found");
            }
            TappLogFrame logFrame = optional.get();
            BeanUtils.copyProperties(dto, logFrame);
            logFrame.setUpdatedBy("admin");
            logFrame.setUpdatedOn(LocalDate.now());
            tappLogFrameRepository.save(logFrame);
            return null;
    }
}


