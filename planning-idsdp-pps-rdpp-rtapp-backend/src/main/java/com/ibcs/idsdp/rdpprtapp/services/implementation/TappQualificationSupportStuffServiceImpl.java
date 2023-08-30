package com.ibcs.idsdp.rdpprtapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappQualificationOfSupportStaff;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappSupportStuff;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappQualificationSupportStuffRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappSupportStaffRepository;
import com.ibcs.idsdp.rdpprtapp.services.TappQualificationSupportStuffService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.TappQualificationSupportStuffRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.TappSupportStuffRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.TappQualificationSupportStuffResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@Transactional
public class TappQualificationSupportStuffServiceImpl extends BaseService<TappQualificationOfSupportStaff, TappQualificationSupportStuffRequest> implements TappQualificationSupportStuffService {

    private TappQualificationSupportStuffRepository tappRepository;
    private TappSupportStaffRepository staffRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private TappObjectiveCostRepository masterRepo;

    public TappQualificationSupportStuffServiceImpl(ServiceRepository<TappQualificationOfSupportStaff> repository,
                                                    TappQualificationSupportStuffRepository tappRepository,
                                                    TappSupportStaffRepository staffRepository,
                                                    IdGeneratorComponent idGeneratorComponent,
                                                    TappObjectiveCostRepository masterRepo) {
        super(repository);
        this.tappRepository = tappRepository;
        this.staffRepository = staffRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.masterRepo = masterRepo;
    }

    // For Create Qualification Support Stuff
    @Override
    public TappQualificationSupportStuffRequest createSupportStuff(TappQualificationSupportStuffRequest qualificationSupportStuffRequest) {

        try {
            String uuid = idGeneratorComponent.generateUUID();
            TappQualificationOfSupportStaff supportStaff = new TappQualificationOfSupportStaff();

            supportStaff.setUuid(uuid);
            supportStaff.setCreatedBy("amdin");
            supportStaff.setCreatedOn(LocalDate.now());
            supportStaff.setIsDeleted(false);
            supportStaff.setTappMasterId(masterRepo.findByProjectConceptUuidAndIsDeleted(qualificationSupportStuffRequest.getProjectConceptUuid(), false).get());
            supportStaff.setProjectConceptUuid(qualificationSupportStuffRequest.getProjectConceptUuid());
            supportStaff.setProjectConceptId(qualificationSupportStuffRequest.getProjectConceptId());
            supportStaff.setDpaFund(qualificationSupportStuffRequest.getDpaFund());
            supportStaff.setRpaFund(qualificationSupportStuffRequest.getRpaFund());
            supportStaff.setGobFund(qualificationSupportStuffRequest.getGobFund());
            supportStaff.setOthers(qualificationSupportStuffRequest.getOthers());

            // For save data Support stuff child table
            List<TappSupportStuff> supportStuffList = new ArrayList<>();
            List<TappSupportStuffRequest> supportStuffRequestList = qualificationSupportStuffRequest.getTappSupportStuffList();
            for (TappSupportStuffRequest request : supportStuffRequestList) {
                String uuuid = idGeneratorComponent.generateUUID();
                TappSupportStuff supportStuffs = new TappSupportStuff();

                supportStuffs.setCreatedBy("admin");
                supportStuffs.setCreatedOn(LocalDate.now());
                supportStuffs.setIsDeleted(false);
             supportStuffs.setDesignation(request.getDesignation());
             supportStuffs.setEducationalQualification(request.getEducationalQualification());
             supportStuffs.setExperience(request.getExperience());
             supportStuffs.setTaskPerformed(request.getTaskPerformed());
             supportStuffs.setProjectConceptMasterId(request.getProjectConceptMasterId());
             supportStuffs.setUuid(uuuid);
             supportStuffList.add(supportStuffs);
             staffRepository.save(supportStuffs);
            }
            supportStaff.setTappSupportStuffList(supportStuffList);

            // Save DppObjectiveCost Objects ;
            tappRepository.save(supportStaff);
            return qualificationSupportStuffRequest;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    @Override
    public ResponseWithResults getQualificationSupportStuff(String pcUuid) {
        Optional<TappQualificationOfSupportStaff> supportStaff = tappRepository.findAllByProjectConceptUuidAndIsDeleted(pcUuid, false);
        if(!supportStaff.isPresent()){
            return new ResponseWithResults(0, "Not Found", supportStaff);
        }else{
            TappQualificationOfSupportStaff qualificationOfSupportStaff = supportStaff.get();
            TappQualificationSupportStuffResponse response = new TappQualificationSupportStuffResponse();
            BeanUtils.copyProperties(qualificationOfSupportStaff, response);

            List<TappSupportStuffRequest> supportStuffRequestList = new ArrayList<>();
            List<TappSupportStuff> list = qualificationOfSupportStaff.getTappSupportStuffList();
            for(TappSupportStuff supportStuffs : list){
                TappSupportStuffRequest request = new TappSupportStuffRequest();
                BeanUtils.copyProperties(supportStuffs, request);
                supportStuffRequestList.add(request);
            }
            response.setTappSupportStuffList(supportStuffRequestList);
            return new ResponseWithResults(1, "Success", response);

        }
    }


    public TappQualificationSupportStuffResponse updateSupportStuff(TappQualificationSupportStuffResponse request, String pcUuid) {
        Optional<TappQualificationOfSupportStaff> optional = tappRepository.findAllByProjectConceptUuidAndIsDeleted(pcUuid, false);
        if(!optional.isPresent()){
            throw new RuntimeException("Qualification Support Stuff not Found");
        }
        TappQualificationOfSupportStaff supportStaff = optional.get();
        supportStaff.setUpdatedOn(LocalDate.now());
        supportStaff.setUpdatedBy("admin");
        supportStaff.setDpaFund(request.getDpaFund());
        supportStaff.setGobFund(request.getGobFund());
        supportStaff.setRpaFund(request.getRpaFund());
        supportStaff.setOthers(request.getOthers());

        List<TappSupportStuff> list = getAllSupportStuff(supportStaff.getProjectConceptId());
        staffRepository.deleteAll(list);
        List<TappSupportStuff> requestList = new ArrayList<>();
        List<TappSupportStuffRequest> stuffList = request.getTappSupportStuffList();
        for(TappSupportStuffRequest stuff : stuffList){
            String uuid = idGeneratorComponent.generateUUID();
            TappSupportStuff dot = new TappSupportStuff();
            dot.setCreatedOn(LocalDate.now());
            dot.setCreatedBy("user");
            dot.setIsDeleted(false);
            dot.setUuid(uuid);
            dot.setTaskPerformed(stuff.getTaskPerformed());
            dot.setEducationalQualification(stuff.getEducationalQualification());
            dot.setExperience(stuff.getExperience());
            dot.setDesignation(stuff.getDesignation());
            dot.setProjectConceptMasterId(stuff.getProjectConceptMasterId());
            requestList.add(dot);
        }
        supportStaff.setTappSupportStuffList(requestList);

        tappRepository.save(supportStaff);


        return null;
    }

    public List<TappSupportStuff> getAllSupportStuff(Long id){
        return staffRepository.findAllByProjectConceptMasterId(id);
    }

}
