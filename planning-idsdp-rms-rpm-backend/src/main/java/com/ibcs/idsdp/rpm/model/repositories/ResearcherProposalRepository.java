package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResearcherProposalRepository  extends ServiceRepository<ResearcherProposal> {

    List<ResearcherProposal> findByStFiscalYearIdAndIsDeleted(Long fiscalYearId, Boolean isDeleted);

    ResearcherProposal findByResearcherProfilePersonalInfoMasterIdAndIsDeleted(Long resProfilePersonalInfoId, Boolean isDeleted);

    List<ResearcherProposal> findAllByStFiscalYearIdAndIsDeleted(Long stFiscalYearId, Boolean isDeleted);
    List<ResearcherProposal> findAllByStFiscalYearIdAndStResearchCatTypeIdAndIsDeleted(Long stFiscalYearId,Long resProfilePersonalInfoId, Boolean isDeleted);
    List<ResearcherProposal> findAllByStResearchCatTypeIdAndIsDeleted(Long stResearchCatTypeId, Boolean isDeleted);
    List<ResearcherProposal> findAllByIsFinalSubmitAndIsDeleted(Boolean isFinalSubmit, Boolean isDeleted);


    List<ResearcherProposal> findAllByStFiscalYearIdAndIsDeletedAndIsFinalSubmit(Long stFiscalYearId, Boolean isDeleted, Boolean isFinalSubmit);
    List<ResearcherProposal> findAllByStFiscalYearIdAndStResearchCatTypeIdAndIsDeletedAndIsFinalSubmit(Long stFiscalYearId,Long stResearchCatTypeId, Boolean isDeleted, Boolean isFinalSubmit);
    List<ResearcherProposal> findAllByStResearchCatTypeIdAndStSectorTypeIdAndIsDeletedAndIsFinalSubmit(Long stResearchCatTypeId, Long stResearchSectorTypeId, Boolean isDeleted, Boolean isFinalSubmit);
    List<ResearcherProposal> findAllByStFiscalYearIdAndStSectorTypeIdAndIsDeletedAndIsFinalSubmit(Long stFiscalYearId, Long stResearchSectorTypeId, Boolean isDeleted, Boolean isFinalSubmit);
    List<ResearcherProposal> findAllByStFiscalYearIdAndStResearchCatTypeIdAndStSectorTypeIdAndIsDeletedAndIsFinalSubmit(Long stFiscalYearId, Long stResearchCatTypeId, Long stResearchSectorTypeId, Boolean isDeleted, Boolean isFinalSubmit);
    List<ResearcherProposal> findAllByStResearchCatTypeIdAndIsDeletedAndIsFinalSubmit(Long stResearchCatTypeId, Boolean isDeleted, Boolean isFinalSubmit);
    List<ResearcherProposal> findAllByStSectorTypeIdAndIsDeletedAndIsFinalSubmit(Long stResearchSectorTypeId, Boolean isDeleted, Boolean isFinalSubmit);
    List<ResearcherProposal> findAllByIsDeletedAndIsFinalSubmit(boolean isDeleted, Boolean isFinalSubmit);

    Page<ResearcherProposal> findAllByResearcherProfilePersonalInfoMasterIdAndIsDeleted(Pageable pageable ,Long resProfilePersonalInfoId,Boolean isDeleted);
    List<ResearcherProposal> findAllByResearcherProfilePersonalInfoMasterIdAndIsDeleted(Long resProfilePersonalInfoId,Boolean isDeleted);
    
    
    @Query(value = "select	mrp.id,	mrp.research_title , mrp.st_research_cat_type_id ,	mrp.st_fiscal_year_id,	mrp.approval_status,	mrsi.supervisor_name,	mlpwe.st_profile_of_expert_evaluators_id from m1_researcher_proposal mrp left join m1_researcher_profile_personal_info mrppi on	mrp.researcher_profile_personal_info_master_id = mrppi.id left join m1_researcher_supervisor_info mrsi on mrp.id = mrsi.researcher_proposal_id left join m1_linkup_proposal_with_evaluators mlpwe on mrp.id = mlpwe.researcher_proposal_id where mrppi.uuid = :researcherProfileUuid order by 1 desc",nativeQuery = true)
	List<Object> findAllByResearcherProfileUuid(String researcherProfileUuid);
    
    List<ResearcherProposal> findAllByResearcherProfilePersonalInfoMasterAndIsDeletedAndApprovalStatus(ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster, Boolean isDeleted, Integer approvalStatus);

    @Query(value = "SELECT COUNT(*) FROM m1_researcher_proposal where approval_status = :approvalStatusId and is_deleted = :isDeleted And is_final_submit = true", nativeQuery=true)
    Integer getProposalCountByApproveStatusAndIsDeleted(Integer approvalStatusId, Boolean isDeleted);

    @Query(value = "SELECT COUNT(*) FROM m1_researcher_proposal where approval_status = :approvalStatusId and is_deleted = :isDeleted and st_fiscal_year_id = :fiscalYearId And is_final_submit = true", nativeQuery=true)
    int getProposalCountByApproveStatusAndFiscalYearIdAndIsDeleted(int approvalStatusId,long fiscalYearId, Boolean isDeleted);

    List<ResearcherProposal> getAllByStResearchCatTypeIdAndIsDeleted(Long id, Boolean isDeleted);
    List<ResearcherProposal> getAllByStResearchCatTypeIdAndIsFinalSubmitAndIsDeleted(Long id,Boolean isFinalSubmit, Boolean isDeleted);

    List<ResearcherProposal> getAllByStResearchCatTypeIdAndIsDeletedAndStFiscalYearId(Long id, Boolean isDeleted,long fiscalYearId);
    List<ResearcherProposal> getAllByStResearchCatTypeIdAndIsFinalSubmitAndIsDeletedAndStFiscalYearId(Long id,Boolean isFinalSubmit, Boolean isDeleted,long fiscalYearId);
    
    List<ResearcherProposal> getAllByStResearchCatTypeId(Long id);

    List<ResearcherProposal> findAllByIsDeletedAndApprovalStatus(boolean isDeleted, Integer approvalStatus);


    @Query(value = "select * from m1_researcher_proposal mrp \n" +
            "where mrp.st_fiscal_year_id =(select st_fiscal_year_id from fs_fiscal_year_wise_sector_sub_sectors \n" +
            "where is_active =true \n" +
            "and letter_for ='Final Copy'\n" +
            "and is_deleted =false )\n" +
            "and researcher_profile_personal_info_master_id =(\n" +
            "select id from m1_researcher_profile_personal_info\n" +
            "where uuid =?\n" +
            ") and mrp.is_deleted = false", nativeQuery = true)
    ResearcherProposal getProposalByProfileId(String uuid);


    Optional<ResearcherProposal> findByUuidAndIsFinalSubmitAndIsDeleted(String uuid, boolean isFinalSubmit, boolean isDeleted);
}
