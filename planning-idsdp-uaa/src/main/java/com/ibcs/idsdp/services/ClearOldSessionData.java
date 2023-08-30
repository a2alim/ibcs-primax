package com.ibcs.idsdp.services;

import com.ibcs.idsdp.model.repositories.SessionDataRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.Date;


@Service
@EnableScheduling
@Slf4j
public class ClearOldSessionData {
    final private SessionDataRepository sessionDataRepository;

    public ClearOldSessionData(SessionDataRepository sessionDataRepository) {
        this.sessionDataRepository = sessionDataRepository;
    }

    @Scheduled(cron = "0 0 1 * * ?") //every day 1 am
    //@Scheduled(cron = "0 * * ? * *") //every minute
    @Transactional
    public void DeleteOldData(){
        try {
            LocalDate desireDate = LocalDate.now().minusDays(7);
            sessionDataRepository.deleteByCreationTimeBefore(desireDate);
            log.info("Old Session Deleted: ",new Date());
        } catch (Exception exception){
            log.info("Old Session Deleted: ",exception.getMessage());
        }
    }
}
