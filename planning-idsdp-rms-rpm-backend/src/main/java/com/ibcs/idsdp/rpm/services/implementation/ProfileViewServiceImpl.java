package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.rpm.model.domain.*;
import com.ibcs.idsdp.rpm.model.repositories.*;
import com.ibcs.idsdp.rpm.services.ProfileViewService;
import lombok.AllArgsConstructor;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

/**
 * @author rakibul.hasan
 * @create 10/13/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@AllArgsConstructor
public class ProfileViewServiceImpl implements ProfileViewService {

    final Logger logger = LoggerFactory.getLogger(ProfileViewServiceImpl.class);

    private final ResearcherProfilePersonalInfoMasterRepository personalInfo;

    private final RelativeInfoRepository relativeInfoRepository;
    private final EducationInfoRepository educationInfoRepository;
    private final PublicationRepository publicationRepository;
    private final ProfileTrainingRepository profileTrainingRepository;
    private final ProfessionalExperienceRepository professionalExperienceRepository;
    private final ResearchExperienceRepository researchExperienceRepository;


    @Override
    @Async(value = "profileExecutor")
    public CompletableFuture<ResearcherProfilePersonalInfoMaster> getPersonalInfo(String uuid) {
        logger.info("Personal Info Loaded By "+Thread.currentThread().getName());
      Optional< ResearcherProfilePersonalInfoMaster> infoData =personalInfo.findByUuid(uuid);
        ResearcherProfilePersonalInfoMaster infoDataget=null;
        if(infoData.isPresent()) {
            infoDataget=infoData.get();

        }else{
            logger.info("no");
        }

        return CompletableFuture.completedFuture(infoDataget);
    }

    @Override
    @Async(value = "profileExecutor")
    public CompletableFuture<ResearcherProfilePersonalInfoMaster> getPersonalInfoById(Long id) {
        logger.info("Personal Info Loaded By "+Thread.currentThread().getName());
      Optional< ResearcherProfilePersonalInfoMaster> infoData =personalInfo.findByIdAndIsDeleted(id, false);
        ResearcherProfilePersonalInfoMaster infoDataget=null;
        if(infoData.isPresent()) {
            infoDataget=infoData.get();

        }else{
            logger.info("no");
        }

        return CompletableFuture.completedFuture(infoDataget);
    }

    @Override
    @Async(value = "profileExecutor")
    public CompletableFuture<List<RelativeInfo>> getRelativeInfo(Long id) {
        logger.info("RelativeInfo Info Loaded By "+Thread.currentThread().getName());
      List<RelativeInfo> rlinfoList=relativeInfoRepository.findAllByProfilePersonalInfoId(id);
        return CompletableFuture.completedFuture(rlinfoList);
    }

    @Override
    @Async(value = "profileExecutor")
    public CompletableFuture<List<EducationInfo>> getEducationInfo(Long id) {
        logger.info("Education Info Loaded By "+Thread.currentThread().getName());
        List<EducationInfo> educationInfo=educationInfoRepository.findAllByProfilePersonalInfoIdAndIsDeleted(id,false);
        return CompletableFuture.completedFuture(educationInfo);
    }

    @Override
    @Async(value = "profileExecutor")
    public CompletableFuture<List<PublicationInfo>> getPublicationInfo(Long id) {
        logger.info("Publication Info Loaded By "+Thread.currentThread().getName());
        List<PublicationInfo> publicationInfo=publicationRepository.findAllByProfilePersonalInfoIdAndIsDeleted(id,false);
        return CompletableFuture.completedFuture(publicationInfo);
    }

    @Override
    @Async(value = "profileExecutor")
    public CompletableFuture<List<ProfessionalExperience>> professionalExperience(Long id) {
        logger.info("ProfessionalExperience Info Loaded By "+Thread.currentThread().getName());
        List<ProfessionalExperience> professionalExperiences=professionalExperienceRepository.findAllByProfilePersonalInfoId(id);
        return CompletableFuture.completedFuture(professionalExperiences);
    }

    @Override
    @Async(value = "profileExecutor")
    public CompletableFuture<List<ResearchExperience>> researchExperience(Long id) {
        logger.info("ResearchExperience Info Loaded By "+Thread.currentThread().getName());
        List<ResearchExperience> researchExperiences=researchExperienceRepository.findAllByProfilePersonalInfoIdAndIsDeleted(id,false);
        return CompletableFuture.completedFuture(researchExperiences);
    }

    @Override
    @Async(value = "profileExecutor")
    public CompletableFuture<List<ProfileTraining>> getTrainingInfo(Long id) {
        logger.info("Training Info Loaded By "+Thread.currentThread().getName());
        List<ProfileTraining> trainings=profileTrainingRepository.findAllByProfilePersonalInfoId(id);
        return CompletableFuture.completedFuture(trainings);
    }
}
