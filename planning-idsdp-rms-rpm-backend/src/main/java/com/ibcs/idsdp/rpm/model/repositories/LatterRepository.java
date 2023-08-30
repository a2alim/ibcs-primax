package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.rpm.model.domain.Latter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author moniruzzaman.rony
 * @create 10/21/21
 * @github `https://github.com/moniruzzamanrony`
 */
public interface LatterRepository extends JpaRepository<Latter, Long> {

	List<Latter> findAllByIsDeleted(boolean isDeleted);

	@Query(value = "select" + " mrp.research_title," + "mrp.st_research_cat_type_id ," + "mrp.st_sector_type_id ,"
			+ "mrp.st_sub_sectors_id," + "mrp.st_fiscal_year_id," + "mrp.st_sdgs_goals_id," + "mrppi.email_address ,"
			+ "mrppi.mobile_no ," + "mrppi.inst_telephone_no ," + "mrppi.reg_number," + "ruui.user_image_url,"
			+ "rus.signature_image_url," + "rcl.memorandum_no ," + "rcl.nothi_date_en," + "rcl.nothi_date_bn ,"
			+ "mrppi.user_id ," + "mrppi.pre_division_id ," + "mrppi.pre_district_id ," + "mrppi.pre_upzila_id ,"
			+ "mrppi.is_institutional," + "mrppi.inst_address_details," + "rcl.subject," + "rcl.mail_body, rcl.mail_status " + " from"
			+ " m1_researcher_proposal mrp" + " left join m1_researcher_profile_personal_info mrppi on"
			+ " mrp.researcher_profile_personal_info_master_id = mrppi.id" + " left join rms_upload_users_image ruui on"
			+ " mrppi.rms_user_image_id = ruui.id" + " left join rms_user_signature rus on"
			+ " rus.id = mrppi.rms_user_signature_id" + " left join rms_create_letters rcl on"
			+ " mrp.id=rcl.researcher_proposal_id " + " where" + " rcl.id=:proposalId", nativeQuery = true)
	Object getLetterDetailsById(Long proposalId);

	@Query(value = "select * from rms_create_letters cl\n" +
			"         join m1_researcher_proposal rp\n" +
			"              on cl.researcher_proposal_id = rp.id\n" +
			"where rp.st_research_cat_type_id =:catId and cl.is_deleted=false", nativeQuery = true)
	List<Latter> getLetterByResearcherCategory(Long catId);

}
