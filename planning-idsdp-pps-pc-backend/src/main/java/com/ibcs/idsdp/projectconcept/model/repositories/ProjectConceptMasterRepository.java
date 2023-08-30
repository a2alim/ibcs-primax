package com.ibcs.idsdp.projectconcept.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.projectconcept.model.domain.ProjectConceptMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ProjectConceptMasterRepository extends ServiceRepository<ProjectConceptMaster> {

    //--------------------feasibility study----------------------
    /*Page<ProjectConceptMaster> findAllBySectorDivisionIdAndIsFsRequiredAndIsDeletedOrderByIdDesc(Long sectorDivisionId, Boolean isFsRequired, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByProjectTypeIdAndIsFsRequiredAndIsDeletedOrderByIdDesc(Long projectType, Boolean isFsRequired, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByIsForeignAidAndIsFsRequiredAndIsDeletedOrderByIdDesc(Boolean isForeignAid, Boolean isFsRequired, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByIsFsRequiredAndGobGreaterThanAndIsDeletedOrderByIdDesc(Boolean isFsRequired, Double gob, Boolean isDeleted, Pageable pageable);


    Page<ProjectConceptMaster> findAllByProjectTypeAndSectorDivisionIdAndIsFsRequiredAndGobGreaterThanAndIsDeletedOrderByIdDesc(Long projectType,
                                                                                                                                Long sectorDivisionId, Boolean isFsRequired, Double gob, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByProjectTypeAndSectorDivisionIdAndIsForeignAidAndIsFsRequiredAndIsDeletedOrderByIdDesc(Long projectType,
                                                                                                                              Long sectorDivisionId, Boolean isForeignAid, Boolean isFsRequired, Boolean isDeleted, Pageable pageable);


    Page<ProjectConceptMaster> findAllByProjectTypeAndSectorDivisionIdAndIsFsRequiredAndIsDeletedOrderByIdDesc(Long projectType,
                                                                                                               Long sectorDivisionId, Boolean isFsRequired, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByProjectTypeAndIsForeignAidAndIsFsRequiredAndIsDeletedOrderByIdDesc(Long projectType,
                                                                                                           Boolean isForeignAid, Boolean isFsRequired, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByProjectTypeAndGobGreaterThanAndIsFsRequiredAndIsDeletedOrderByIdDesc(Long projectType,
                                                                                                             Double gob, Boolean isFsRequired, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllBySectorDivisionIdAndIsForeignAidAndIsFsRequiredAndIsDeletedOrderByIdDesc(Long sectorDivisionId,
                                                                                                                Boolean isForeignAid, Boolean isFsRequired, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllBySectorDivisionIdAndGobGreaterThanAndIsFsRequiredAndIsDeletedOrderByIdDesc(Long sectorDivisionId,
                                                                                                                  Double gob, Boolean isFsRequired, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByIsFsRequiredAndIsDeletedOrderByIdDesc(Boolean isFsRequired, Boolean isDeleted, Pageable pageable);
*/
    //---------------------project concept-----------------------------
    Page<ProjectConceptMaster> findAllBySectorDivisionIdAndIsDeletedOrderByIdDesc(Long sectorDivisionId, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByProjectTypeIdAndIsDeletedOrderByIdDesc(Long projectType, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByIsForeignAidAndIsDeletedOrderByIdDesc(Boolean isForeignAid, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByGobAmountGreaterThanAndIsDeletedOrderByIdDesc(Double gob, Boolean isDeleted, Pageable pageable);


    /*Page<ProjectConceptMaster> findAllByProjectTypeAndSectorDivisionIdAndGobGreaterThanAndIsDeletedOrderByIdDesc(Long projectType,
                                                                                                                 Long sectorDivisionId, Double gob, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByProjectTypeAndSectorDivisionIdAndIsForeignAidAndIsDeletedOrderByIdDesc(Long projectType,
                                                                                                               Long sectorDivisionId, Boolean isForeignAid, Boolean isDeleted, Pageable pageable);


    Page<ProjectConceptMaster> findAllByProjectTypeAndSectorDivisionIdAndIsDeletedOrderByIdDesc(Long projectType,
                                                                                                Long sectorDivisionId, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByProjectTypeAndIsForeignAidAndIsDeletedOrderByIdDesc(Long projectType,
                                                                                            Boolean isForeignAid, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllByProjectTypeAndGobGreaterThanAndIsDeletedOrderByIdDesc(Long projectType,
                                                                                              Double gob, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllBySectorDivisionIdAndIsForeignAidAndIsDeletedOrderByIdDesc(Long sectorDivisionId,
                                                                                                 Boolean isForeignAid, Boolean isDeleted, Pageable pageable);

    Page<ProjectConceptMaster> findAllBySectorDivisionIdAndGobGreaterThanAndIsDeletedOrderByIdDesc(Long sectorDivisionId,
                                                                                                   Double gob, Boolean isDeleted, Pageable pageable);
*/
    @Query(value = "select * from project_concept_master pc " +
            "where pc.is_deleted= false " +
            "and ( lower (pc.title_bn) like %:value% " +
            "or CAST (pc.total_amount AS varchar ) like %:value% " +
            "or CAST (pc.gob_amount AS varchar ) like %:value% " +
            "or CAST (pc.fe_own_fund_amount AS varchar ) like %:value% " +
            "or CAST (pc.pa_amount AS varchar ) like %:value% " +
            "or CAST (pc.rpa_amount AS varchar ) like %:value% " +
            "or CAST (pc.total_amount AS varchar ) like %:value% " +
            "or CAST (pc.fe_other_amount AS varchar ) like %:value% " +
            "or lower (pc.title_en) like %:value%) ", nativeQuery = true)
    Page<ProjectConceptMaster> findAllByValue(String value, Pageable pageable);

    List<ProjectConceptMaster> findByAgencyId(Long agencyId);

    List<ProjectConceptMaster> findByAgencyIdAndSourceModuleType(Long agencyId, String sourceModule);

    List<ProjectConceptMaster> findByAgencyIdInAndSourceModuleType(Set<Long> agencyIds, String sourceModule);
    List<ProjectConceptMaster> findBySectorDivisionIdAndSourceModuleType(Long sectorDivisionId, String sourceModule);

    @Query(value = "select distinct pcm.* from project_concept_master pcm\n" +
            "where pcm.id not in (\n" +
            "\tselect distinct pcm.id from project_concept_master pcm \n" +
            "\tinner join dpp_master dm on dm.project_concept_master_id = pcm.id\n" +
            "\tinner join project_movement_stage pms on pms.dpp_master_id = dm.id\n" +
            "\tand pms.current_stage in (7, 9, 10)\n" +
            "\t)\n" +
            "and pcm.id not in (\n" +
            "\tselect distinct pcm.id from project_concept_master pcm \n" +
            "\tinner join tapp_objective_cost toc on toc.project_concept_master_id = pcm.id\n" +
            "\tinner join project_movement_stage pms on pms.tapp_master_id = toc.id\n" +
            "\tand pms.current_stage in (7, 9, 10)\n" +
            "\t)\n" +
            "and pcm.source_module_type = 'DPP_TAPP'\n" +
            "and pcm.is_deleted = :isDeleted\n" +
            "order by created_on desc", nativeQuery = true)
    List<ProjectConceptMaster> findAllDppTappBeforeApprovedAndIsDeleted(Boolean isDeleted);

    @Query(value = "select distinct pcm.* from project_concept_master pcm\n" +
            "where (pcm.id in (\n" +
            "\tselect distinct pcm.id from project_concept_master pcm \n" +
            "\tinner join dpp_master dm on dm.project_concept_master_id = pcm.id\n" +
            "\tinner join project_movement_stage pms on pms.dpp_master_id = dm.id\n" +
            "\twhere pcm.source_module_type = 'DPP_TAPP'\n" +
            "\tand pms.current_stage in (7, 9, 10)\n" +
            "\tand pcm.pps_code is not null\n" +
            "\tand pcm.is_ecnec_acknowledgement is not true\n" +
            "\t)\n" +
            "\tor pcm.id in (\n" +
            "\tselect distinct pcm.id from project_concept_master pcm \n" +
            "\tinner join tapp_objective_cost toc on toc.project_concept_master_id = pcm.id\n" +
            "\tinner join project_movement_stage pms on pms.tapp_master_id = toc.id\n" +
            "\twhere pcm.source_module_type = 'DPP_TAPP'\n" +
            "\tand pms.current_stage in (7, 9, 10)\n" +
            "\tand pcm.pps_code is not null\n" +
            "\tand pcm.is_ecnec_acknowledgement is not true\n" +
            "\t))\n" +
            "and pcm.is_deleted = :isDeleted\n" +
            "order by movement_date desc", nativeQuery = true)
    List<ProjectConceptMaster> findAllApprovedDppTappAndIsDeleted(Boolean isDeleted);

    @Query(value = "select distinct pcm.* from project_concept_master pcm\n" +
            "where (pcm.id in (\n" +
            "\tselect distinct pcm.id from project_concept_master pcm \n" +
            "\tinner join dpp_master dm on dm.project_concept_master_id = pcm.id\n" +
            "\tinner join project_movement_stage pms on pms.dpp_master_id = dm.id\n" +
            "\twhere pcm.source_module_type = 'DPP_TAPP'\n" +
            "\tand pms.current_stage in (7, 9, 10)\n" +
            "\tand pcm.pps_code is not null\n" +
            "\tand (pcm.epims_code is null or pcm.epims_code = '') \n" +
            "\t)\n" +
            "\tor pcm.id in (\n" +
            "\tselect distinct pcm.id from project_concept_master pcm \n" +
            "\tinner join tapp_objective_cost toc on toc.project_concept_master_id = pcm.id\n" +
            "\tinner join project_movement_stage pms on pms.tapp_master_id = toc.id\n" +
            "\twhere pcm.source_module_type = 'DPP_TAPP'\n" +
            "\tand pms.current_stage in (7, 9, 10)\n" +
            "\tand pcm.pps_code is not null\n" +
            "\tand (pcm.epims_code is null or pcm.epims_code = '') \n" +
            "\t))\n" +
            "and pcm.is_deleted = :isDeleted\n" +
            "order by movement_date desc", nativeQuery = true)
    List<ProjectConceptMaster> findAllApprovedDppTappAndIsDeletedForEpims(Boolean isDeleted);

    @Query(value = "select distinct pcm.* from project_concept_master pcm\n" +
            "where (pcm.id in (\n" +
            "\tselect distinct pcm.id from project_concept_master pcm \n" +
            "\tinner join dpp_master dm on dm.project_concept_master_id = pcm.id\n" +
            "\tinner join project_movement_stage pms on pms.dpp_master_id = dm.id\n" +
            "\twhere pcm.source_module_type = 'DPP_TAPP'\n" +
            "\tand pms.current_stage in (2, 3)\n" +
            "\tand pcm.pps_code is not null\n" +
            "\tand (pcm.spims_code is null or pcm.spims_code = '') \n" +
            "\t)\n" +
            "\tor pcm.id in (\n" +
            "\tselect distinct pcm.id from project_concept_master pcm \n" +
            "\tinner join tapp_objective_cost toc on toc.project_concept_master_id = pcm.id\n" +
            "\tinner join project_movement_stage pms on pms.tapp_master_id = toc.id\n" +
            "\twhere pcm.source_module_type = 'DPP_TAPP'\n" +
            "\tand pms.current_stage in (2, 3)\n" +
            "\tand pcm.pps_code is not null\n" +
            "\tand (pcm.spims_code is null or pcm.spims_code = '') \n" +
            "\t))\n" +
            "and pcm.is_deleted = :isDeleted\n" +
            "order by movement_date desc", nativeQuery = true)
    List<ProjectConceptMaster> findAllDppTappAndIsDeletedForSpims(Boolean isDeleted);

    Optional<ProjectConceptMaster> findByPpsCodeAndIsDeleted(String ppsCode, Boolean isDeleted);

    @Query(value = "select distinct pcm.* from project_concept_master pcm\n" +
            "where pcm.source_module_type = 'DPP_TAPP'\n" +
            "and pcm.sector_division_id = case when cast(:sectorDivisionId as int) = 0 then pcm.sector_division_id else cast(:sectorDivisionId as int) end\n" +
            "and pcm.sector_id = case when cast(:sectorId as int) = 0 then pcm.sector_id else cast(:sectorId as int) end\n" +
            "and pcm.sub_sector_id = case when cast(:subSectorId as int) = 0 then pcm.sub_sector_id else cast(:subSectorId as int) end\n" +
            "and pcm.project_type_id = case when cast(:projectTypeId as int) = 0 then pcm.project_type_id else cast(:projectTypeId as int) end \n" +
            "and pcm.sponsoring_ministry_name = case when cast(:ministryName as varchar) is null then pcm.sponsoring_ministry_name else cast(:ministryName as varchar) end\n" +
            "and pcm.implementing_agency_name = case when cast(:agencyName as varchar) is null then pcm.implementing_agency_name else cast(:agencyName as varchar) end\n" +
            "and pcm.pa_amount >= case when cast(:paAmountFrom as varchar) is null then 0 else cast(cast(:paAmountFrom as varchar) as numeric) end\n" +
            "and pcm.pa_amount <= case when cast(:paAmountTo as varchar) is null then pcm.pa_amount else cast(cast(:paAmountTo as varchar) as numeric) end\n" +
            "and ( case when :isFundingTypeGob is true then pcm.gob_amount > 0 end\n" +
            "\t\tor case when :isFundingTypeOwn is true then pcm.own_fund_amount > 0 end\n" +
            "\t\tor case when :isFundingTypeOther is true then pcm.other_amount > 0 end\n" +
            "\t\tor case when :isFinancingTypeGob is true then pcm.gob_amount > 0 end\n" +
            "\t\tor case when :isFinancingTypePa is true then pcm.pa_amount > 0 end\n" +
            "\t\tor (case when (:isFundingTypeGob is false and :isFundingTypeOwn is false and :isFundingTypeOther is false\n" +
            "\t\t\tand :isFinancingTypeGob is false and :isFinancingTypePa is false) then pcm.gob_amount >= 0 end)\n" +
            "\t)\n" +
            "and (pcm.id in (select distinct pcm.id from project_concept_master pcm\n" +
            "\t\t\t\tinner join dpp_annual_phasing_cost dapc on dapc.project_concept_id = pcm.id \n" +
            "\t\t\t\tinner join dpp_annual_phasing_cost_total dapct on dapc.dpp_annual_phasing_cost_total_id = dapct.id\n" +
            "\t\t\t\tinner join dpp_master dm on dm.project_concept_master_id = pcm.id \n" +
            "\t\t\t\twhere dapct.gob_amount >= case when cast(:gobAmountFrom as varchar) is null then 0 else cast(cast(:gobAmountFrom as varchar) as numeric) end\n" +
            "\t\t\t\tand dapct.gob_amount <= case when cast(:gobAmountTo as varchar) is null then dapct.gob_amount else cast(cast(:gobAmountTo as varchar) as numeric) end\n" +
            "\t\t\t\tand dapct.own_fund_amount >= case when cast(:ownAmountFrom as varchar) is null then 0 else cast(cast(:ownAmountFrom as varchar) as numeric) end\n" +
            "\t\t\t\tand dapct.own_fund_amount <= case when cast(:ownAmountTo as varchar) is null then dapct.own_fund_amount else cast(cast(:ownAmountTo as varchar) as numeric) end\n" +
            "\t\t\t\tand dapct.own_fund_amount >= case when cast(:totalAmountFrom as varchar) is null then 0 else cast(cast(:totalAmountFrom as varchar) as numeric) end\n" +
            "\t\t\t\tand dapct.own_fund_amount <= case when cast(:totalAmountTo as varchar) is null then dapct.own_fund_amount else cast(cast(:totalAmountTo as varchar) as numeric) end\n" +
            "\t\t\t\tand to_date(cast(dm.date_commencement as varchar), 'YYYY-MM-DD') >= case when cast(:fiscalYearFrom as varchar) is null then to_date(cast(dm.date_commencement as varchar), 'YYYY-MM-DD') else to_date(cast(:fiscalYearFrom as varchar ), 'YYYY-MM-DD') end \n" +
            "\t\t\t\tand to_date(cast(dm.date_commencement as varchar), 'YYYY-MM-DD') <= case when cast(:fiscalYearTo as varchar) is null then to_date(cast(dm.date_commencement as varchar), 'YYYY-MM-DD') else to_date(cast(:fiscalYearTo as varchar ), 'YYYY-MM-DD') end\n" +
            "\t\t\t\t)\n" +
            "\tand pcm.id in (select distinct pcm.id from project_concept_master pcm\n" +
            "\t\t\t\tinner join dpp_master dm on dm.project_concept_master_id = pcm.id\n" +
            "\t\t\t\tinner join dpp_locations dl on dl.dpp_master_id = dm.id \n" +
            "\t\t\t\twhere dl.division = case when cast(:divisionLocationId as varchar) is null then dl.division else cast(:divisionLocationId as bytea) end\n" +
            "\t\t\t\tand dl.zilla = case when cast(:zillaLocationId as varchar) is null then dl.zilla else cast(:zillaLocationId as bytea) end\n" +
            "\t\t\t\tand dl.upazila = case when cast(:upazilaLocationId as varchar) is null then dl.upazila else cast(:upazilaLocationId as bytea) end\n" +
            "\t\t\t\t)\n" +
            "\tor pcm.id in (select distinct pcm.id from project_concept_master pcm\n" +
            "\t\t\t\tinner join tapp_annual_phasing_cost tapc on tapc.project_concept_id = pcm.id \n" +
            "\t\t\t\tinner join tapp_annual_phasing_cost_total tapct on tapc.tapp_annual_phasing_cost_total_id = tapct.id\n" +
            "\t\t\t\tinner join tapp_objective_cost toc on toc.project_concept_master_id = pcm.id \n" +
            "\t\t\t\twhere tapct.gob_amount >= case when cast(:gobAmountFrom as varchar) is null then 0 else cast(cast(:gobAmountFrom as varchar) as numeric) end\n" +
            "\t\t\t\tand tapct.gob_amount <= case when cast(:gobAmountTo as varchar) is null then tapct.gob_amount else cast(cast(:gobAmountTo as varchar) as numeric) end\n" +
            "\t\t\t\tand tapct.own_fund_amount >= case when cast(:ownAmountFrom as varchar) is null then 0 else cast(cast(:ownAmountFrom as varchar) as numeric) end\n" +
            "\t\t\t\tand tapct.own_fund_amount <= case when cast(:ownAmountTo as varchar) is null then tapct.own_fund_amount else cast(cast(:ownAmountTo as varchar) as numeric) end\n" +
            "\t\t\t\tand tapct.own_fund_amount >= case when cast(:totalAmountFrom as varchar) is null then 0 else cast(cast(:totalAmountFrom as varchar) as numeric) end\n" +
            "\t\t\t\tand tapct.own_fund_amount <= case when cast(:totalAmountTo as varchar) is null then tapct.own_fund_amount else cast(cast(:totalAmountTo as varchar) as numeric) end\n" +
            "\t\t\t\tand to_date(cast(toc.date_commencement as varchar), 'YYYY-MM-DD') >= case when cast(:fiscalYearFrom as varchar) is null then to_date(cast(toc.date_commencement as varchar), 'YYYY-MM-DD') else to_date(cast(:fiscalYearFrom as varchar ), 'YYYY-MM-DD') end \n" +
            "\t\t\t\tand to_date(cast(toc.date_commencement as varchar), 'YYYY-MM-DD') <= case when cast(:fiscalYearTo as varchar) is null then to_date(cast(toc.date_commencement as varchar), 'YYYY-MM-DD') else to_date(cast(:fiscalYearTo as varchar ), 'YYYY-MM-DD') end\n" +
            "\t\t\t\t)\n" +
            "\t)\n" +
            "order by created_on desc", nativeQuery = true)
    Page<ProjectConceptMaster> findAllByQuery(int sectorDivisionId, int sectorId, int subSectorId, int projectTypeId, Double paAmountFrom, Double paAmountTo,
                                              Double gobAmountFrom, Double gobAmountTo, Double ownAmountFrom, Double ownAmountTo, Double totalAmountFrom, Double totalAmountTo,
                                              Boolean isFundingTypeGob, Boolean isFundingTypeOwn, Boolean isFundingTypeOther, Boolean isFinancingTypeGob,
                                              Boolean isFinancingTypePa, String ministryName, String agencyName, String fiscalYearFrom, String fiscalYearTo,
                                              Long[] divisionLocationId, Long[] zillaLocationId, Long[] upazilaLocationId, Pageable pageable);


    List<ProjectConceptMaster> findAllByTitleEnAndImplementingAgencyNameAndIsDeleted(String titleEn, String implementingAgencyName, Boolean IsDeleted);

    List<ProjectConceptMaster> findAllByAgencyIdAndSourceModuleTypeAndIsDeletedOrderByMovementDateDesc(Long agencyId, String sourceModuleType, Boolean isDeleted);
}
