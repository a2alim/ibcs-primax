package com.ibcs.idsdp.dpptapp.services;


import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.DppLogFrame;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.LogFrameRepository;
import com.ibcs.idsdp.dpptapp.web.dto.LogFrameDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.LogFrameResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
public class LogFrameServiceImp extends BaseService<DppLogFrame, LogFrameDTO> implements LogFrameService {

    private final LogFrameRepository logFrameRepository;
    private final DppObjectiveCostRepository dppObjectiveCostRepository;

    public LogFrameServiceImp(LogFrameRepository logFrameRepository, DppObjectiveCostRepository dppObjectiveCostRepository) {
        super(logFrameRepository);
        this.logFrameRepository = logFrameRepository;
        this.dppObjectiveCostRepository = dppObjectiveCostRepository;

    }

    /**
     * convertForCreate for using base method
     * @param logFrameDTO
     * @return
     */
    @Override
    protected DppLogFrame convertForCreate(LogFrameDTO logFrameDTO) {
        DppLogFrame dppLogFrame = super.convertForCreate(logFrameDTO);
        dppLogFrame.setDppMasterId(dppObjectiveCostRepository.findByProjectConceptUuid(logFrameDTO.getProjectConceptUuid()));
        dppLogFrame.setProjectConceptMasterId(logFrameDTO.getProjectConceptMasterId());
        return dppLogFrame;
    }

    /**
     * Get Log Frame By Pcid
     * @param pcid
     * @return
     */
    @Override
    public DppLogFrame getLogFrameByPcid(Long pcid) {
        try {
            DppLogFrame dppLogFrame = logFrameRepository.findByProjectConceptMasterIdAndIsDeleted(pcid, false);
            return dppLogFrame;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /* -------------  for Get Log Frame Data  ---------------*/
    @Override
    public ResponseWithResults getLogFrame(String pcUuid) {
        try {
            Optional<DppLogFrame> logFrame = logFrameRepository.findAllByProjectConceptUuid(pcUuid);
            if (!logFrame.isPresent()){
                return new ResponseWithResults(0, "Not Found","");
            }else{
                DppLogFrame dppLogFrame = logFrame.get();
                LogFrameResponse response = new LogFrameResponse();
                response.setDateOfLogFrame(dppLogFrame.getDateOfLogFrame());
                response.setGoalMOV(dppLogFrame.getGoalMOV());
                response.setGoalNS(dppLogFrame.getGoalNS());
                response.setGoalOVI(dppLogFrame.getGoalOVI());
                response.setInputIA(dppLogFrame.getInputIA());
                response.setInputMOV(dppLogFrame.getInputMOV());
                response.setInputNS(dppLogFrame.getInputNS());
                response.setInputOVI(dppLogFrame.getInputOVI());
                response.setOutputIA(dppLogFrame.getOutputIA());
                response.setOutputMOV(dppLogFrame.getOutputMOV());
                response.setOutputNS(dppLogFrame.getOutputNS());
                response.setOutputOVI(dppLogFrame.getOutputOVI());
                response.setObjectiveIA(dppLogFrame.getObjectiveIA());
                response.setObjectiveMOV(dppLogFrame.getObjectiveMOV());
                response.setObjectiveNS(dppLogFrame.getObjectiveNS());
                response.setObjectiveOVI(dppLogFrame.getObjectiveOVI());
                response.setUuid(dppLogFrame.getUuid());
                return new ResponseWithResults(1, "Success", response);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }


    /* -------------  for Update Log Frame ---------------*/
    @Override
    public LogFrameResponse updateLogFrame(LogFrameResponse response, String pcUuid) {
        Optional<DppLogFrame> optionalDppLogFrame = logFrameRepository.findAllByProjectConceptUuid(pcUuid);
        if(!optionalDppLogFrame.isPresent()){
            throw new RuntimeException("Log Frame Not Found");
        }
        else {
            DppLogFrame logFrame = optionalDppLogFrame.get();
            logFrame.setUpdatedBy("admin");
            logFrame.setUpdatedOn(LocalDate.now());
            logFrame.setDateOfLogFrame(response.getDateOfLogFrame());
            logFrame.setGoalMOV(response.getGoalMOV());
            logFrame.setGoalNS(response.getGoalNS());
            logFrame.setGoalOVI(response.getGoalOVI());
            logFrame.setInputIA(response.getInputIA());
            logFrame.setInputMOV(response.getInputMOV());
            logFrame.setInputNS(response.getInputNS());
            logFrame.setInputOVI(response.getInputOVI());
            logFrame.setOutputIA(response.getOutputIA());
            logFrame.setOutputMOV(response.getOutputMOV());
            logFrame.setOutputNS(response.getOutputNS());
            logFrame.setOutputOVI(response.getOutputOVI());
            logFrame.setObjectiveIA(response.getObjectiveIA());
            logFrame.setObjectiveMOV(response.getObjectiveMOV());
            logFrame.setObjectiveNS(response.getObjectiveNS());
            logFrame.setObjectiveOVI(response.getObjectiveOVI());
            logFrame.setUuid(response.getUuid());
            logFrameRepository.save(logFrame);
        }
        return null;
    }
}


