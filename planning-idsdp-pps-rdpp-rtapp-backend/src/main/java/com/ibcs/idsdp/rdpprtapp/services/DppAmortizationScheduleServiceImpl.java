package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.AmortizationScheduleReportDto;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppAmortizationSchedule;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppAmortizationScheduleDetails;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppAmortizationScheduleDetailsRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppAmortizationScheduleRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAmortizationScheduleDetailsDto;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAmortizationScheduleDetailsListDto;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppAmortizationScheduleDetailsGraceRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppAmortizationScheduleDetailsLoanRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppAmortizationScheduleRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.DppAmortizationScheduleResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
public class DppAmortizationScheduleServiceImpl implements DppAmortizationScheduleService {

    private final DppAmortizationScheduleRepository dppAmortizationScheduleRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final DppAmortizationScheduleDetailsRepository amortizationScheduleDetailsRepository;
    private final DppObjectiveCostRepository objectiveCostRepository;

    public DppAmortizationScheduleServiceImpl(DppAmortizationScheduleRepository dppAmortizationScheduleRepository,
                                              IdGeneratorComponent idGeneratorComponent,
                                              DppAmortizationScheduleDetailsRepository amortizationScheduleDetailsRepository,
                                              DppObjectiveCostRepository objectiveCostRepository) {
        this.dppAmortizationScheduleRepository = dppAmortizationScheduleRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.amortizationScheduleDetailsRepository = amortizationScheduleDetailsRepository;
        this.objectiveCostRepository = objectiveCostRepository;
    }

    @Override
    public DppAmortizationScheduleRequest createAmortizationSchedule(DppAmortizationScheduleRequest request) {
        try {
            String uuid = idGeneratorComponent.generateUUID();
            DppAmortizationSchedule schedule = new DppAmortizationSchedule();
            schedule.setCreatedBy("user");
            schedule.setCreatedOn(LocalDate.now());
            schedule.setIsDeleted(false);
            BeanUtils.copyProperties(request, schedule);
            schedule.setUuid(uuid);


            // for make list for Amortization Schedule List from DTO;
            List<DppAmortizationScheduleDetails> detailsArrayList = new ArrayList<>();
            List<DppAmortizationScheduleDetailsLoanRequest> detailsLoanRequests = request.getLoanPeriods();
            for (DppAmortizationScheduleDetailsLoanRequest dto : detailsLoanRequests) {
                DppAmortizationScheduleDetails loanDetails = new DppAmortizationScheduleDetails();
                // Convert DTO to Objects ;
                BeanUtils.copyProperties(dto, loanDetails);

                String uui = idGeneratorComponent.generateUUID();
                loanDetails.setCreatedBy("admin");
                loanDetails.setIsDeleted(false);
                loanDetails.setCreatedOn(LocalDate.now());
                loanDetails.setUuid(uui);
                loanDetails.setTypes("loadPeriod");
                detailsArrayList.add(loanDetails);

            }

            List<DppAmortizationScheduleDetailsGraceRequest> graceRequests = request.gracePeriods;
            for (DppAmortizationScheduleDetailsGraceRequest dto : graceRequests) {
                DppAmortizationScheduleDetails graceDetails = new DppAmortizationScheduleDetails();
                // Convert DTO to Objects ;
                BeanUtils.copyProperties(dto, graceDetails);
                String uui = idGeneratorComponent.generateUUID();
                graceDetails.setCreatedBy("admin");
                graceDetails.setIsDeleted(false);
                graceDetails.setCreatedOn(LocalDate.now());
                graceDetails.setUuid(uui);
                graceDetails.setTypes("gracePeriod");
                detailsArrayList.add(graceDetails);

            }
//            schedule.getAmortizationScheduleList().clear();
            // has many Mode loadPeriod set in master table: DppAmortizationSchedule ;
            schedule.setAmortizationScheduleList(detailsArrayList);


            dppAmortizationScheduleRepository.save(schedule);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }


    // For Update Amortization Schedule
    @Transactional
    @Override
    public DppAmortizationScheduleRequest updateAmortization(DppAmortizationScheduleRequest scheduleRequest, Long id) {
//        // Get Amortization Schedule find by project id
        Optional<DppAmortizationSchedule> amortizationSchedule = dppAmortizationScheduleRepository.findByRdppMasterId(id);
        if (!amortizationSchedule.isPresent()) {

            throw new RuntimeException("Amortization Schedule Not Found");
        }
        DppAmortizationSchedule schedule = amortizationSchedule.get();
        schedule.setUpdatedBy("admin");
        schedule.setUpdatedOn(LocalDate.now());
        // Set data
        schedule.setLoanPeriod(scheduleRequest.getLoanPeriod());
        schedule.setRateOfInterest(scheduleRequest.getRateOfInterest());
        schedule.setGracePeriod(scheduleRequest.getGracePeriod());
        List<DppAmortizationScheduleDetails> dList = getDetails(schedule.getRdppMasterId());
        amortizationScheduleDetailsRepository.deleteAll(dList);
        List<DppAmortizationScheduleDetails> detailsArrayList = new ArrayList<>();
        List<DppAmortizationScheduleDetailsLoanRequest> detailsLoanRequests = scheduleRequest.getLoanPeriods();
        for (DppAmortizationScheduleDetailsLoanRequest dto : detailsLoanRequests) {
            DppAmortizationScheduleDetails loanDetails = new DppAmortizationScheduleDetails();
            // Convert DTO to Objects ;
            BeanUtils.copyProperties(dto, loanDetails);

            String uui = idGeneratorComponent.generateUUID();
            loanDetails.setCreatedBy("admin");
            loanDetails.setIsDeleted(false);
            loanDetails.setCreatedOn(LocalDate.now());
            loanDetails.setUuid(uui);
            loanDetails.setTypes("loadPeriod");
            detailsArrayList.add(loanDetails);

        }

        List<DppAmortizationScheduleDetailsGraceRequest> graceRequests = scheduleRequest.gracePeriods;
        for (DppAmortizationScheduleDetailsGraceRequest dto : graceRequests) {
            DppAmortizationScheduleDetails graceDetails = new DppAmortizationScheduleDetails();
            // Convert DTO to Objects ;
            BeanUtils.copyProperties(dto, graceDetails);
            String uui = idGeneratorComponent.generateUUID();
            graceDetails.setCreatedBy("admin");
            graceDetails.setIsDeleted(false);
            graceDetails.setCreatedOn(LocalDate.now());
            graceDetails.setUuid(uui);
            graceDetails.setTypes("gracePeriod");
            detailsArrayList.add(graceDetails);

        }

        // has many Mode loadPeriod set in master table: DppAmortizationSchedule ;
        schedule.setAmortizationScheduleList(detailsArrayList);

        System.out.println(schedule);
        dppAmortizationScheduleRepository.save(schedule);

        return null;
    }

    // Get Amortization Schedule
    @Override
    public ResponseWithResults getAmortizationSchedule(Long rdppId) {
        Optional<DppAmortizationSchedule> schedule = dppAmortizationScheduleRepository.findByRdppMasterIdAndIsDeleted(rdppId, false);
        if(!schedule.isPresent()){
            return new ResponseWithResults(0, "Not Found", "");
        }else{
            DppAmortizationSchedule amortizationSchedule = schedule.get();
            DppAmortizationScheduleDetailsDto dppAmortizationScheduleDetailsDto = new DppAmortizationScheduleDetailsDto();
            BeanUtils.copyProperties(amortizationSchedule, dppAmortizationScheduleDetailsDto);
            List<DppAmortizationScheduleDetailsListDto> arrayList = new ArrayList<>();
            for(DppAmortizationScheduleDetails details : amortizationSchedule.getAmortizationScheduleList()){
                DppAmortizationScheduleDetailsListDto response = new DppAmortizationScheduleDetailsListDto();
                BeanUtils.copyProperties(details, response);
                arrayList.add(response);
            }
            dppAmortizationScheduleDetailsDto.setAmortizationScheduleList(arrayList);
            return new ResponseWithResults(1, "Success", dppAmortizationScheduleDetailsDto);
        }

    }

    // Get Amortization Schedule Details
    public List<DppAmortizationScheduleDetails> getDetails(Long id){
        return amortizationScheduleDetailsRepository.findAllByProjectConceptMasterId(id);
    }

    @Override
    public ResponseWithResults getAmortizationScheduleReport(Long id) {
        AmortizationScheduleReportDto amortizationScheduleReportDto = new AmortizationScheduleReportDto();
        Optional<DppAmortizationSchedule> amortizationSchedule = dppAmortizationScheduleRepository.findByRdppMasterId(id);
        if (!amortizationSchedule.isPresent()) {

            throw new RuntimeException("Amortization Schedule Not Found");
        }
        DppAmortizationSchedule schedule = amortizationSchedule.get();
        // Set data
        amortizationScheduleReportDto.setProjectName(schedule.getProjectName());
        amortizationScheduleReportDto.setTotalInvestment(schedule.getTotalInvestment());
        amortizationScheduleReportDto.setLoanPortion(schedule.getLoanPortion());
        amortizationScheduleReportDto.setRateOfInterest(schedule.getRateOfInterest());
        List<DppAmortizationScheduleDetails> dList = getDetails(schedule.getRdppMasterId());
        amortizationScheduleReportDto.setAmortizationScheduleList(dList);
        return new ResponseWithResults(200,"Amortization Schedule Found.",amortizationScheduleReportDto);
    }


}
