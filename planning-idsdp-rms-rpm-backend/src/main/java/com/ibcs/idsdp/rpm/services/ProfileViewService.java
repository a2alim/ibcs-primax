package com.ibcs.idsdp.rpm.services;


import com.ibcs.idsdp.rpm.model.domain.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface ProfileViewService {

    CompletableFuture<ResearcherProfilePersonalInfoMaster> getPersonalInfo(String uuid);

    CompletableFuture<ResearcherProfilePersonalInfoMaster> getPersonalInfoById(Long id);

    CompletableFuture<List<RelativeInfo>> getRelativeInfo(Long id);

    CompletableFuture<List<EducationInfo>> getEducationInfo(Long id);

    CompletableFuture<List<PublicationInfo>> getPublicationInfo(Long id);

    CompletableFuture<List<ProfessionalExperience>> professionalExperience(Long id);

    CompletableFuture<List<ResearchExperience>> researchExperience(Long id);

    CompletableFuture<List<ProfileTraining>> getTrainingInfo(Long id);
    //git

}
