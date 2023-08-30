package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.AgencyResponseDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Agency;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.AgencyRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.MinistryDivisionRepository;
import com.ibcs.idsdp.idsdpconfigration.services.AgencyService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.AgencyDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class AgencyServiceImp extends BaseService<Agency, AgencyDTO> implements AgencyService {

    private final AgencyRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final MinistryDivisionRepository ministryDivisionRepository;
    private final MinistryDivisionServiceImp ministryDivisionServiceImp;

    public AgencyServiceImp(AgencyRepository repository, IdGeneratorComponent idGeneratorComponent,
                            MinistryDivisionRepository ministryDivisionRepository, MinistryDivisionServiceImp ministryDivisionServiceImp) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.ministryDivisionRepository = ministryDivisionRepository;
        this.ministryDivisionServiceImp = ministryDivisionServiceImp;
    }

    @Override
    protected AgencyDTO convertForRead(Agency agency) {
        AgencyDTO agencyDTO = super.convertForRead(agency);
        agencyDTO.setMinistryDivisionDTO(ministryDivisionServiceImp.getById(agencyDTO.getMinistryDivisionId()));
        return agencyDTO;
    }

    // Override Base Service method for converting from DTO to Entity and arranging data for Create
    @Override
    protected Agency convertForCreate(AgencyDTO agencyDTO) {
        Agency agency = super.convertForCreate(agencyDTO);
        agency.setCode(idGeneratorComponent.generateCode(agencyDTO.getNameEn(), repository.count()));
        agency.setMinistryDivision(ministryDivisionRepository
                .findByIdAndIsDeleted(agencyDTO.getMinistryDivisionId(), false ).get());
        return agency;
    }

    // Override Base Service method for converting from DTO to Entity and arranging data for Edit
    @Override
    protected void convertForUpdate(AgencyDTO agencyDTO, Agency agency) {
        agencyDTO.setCode(agency.getCode());
        agency.setMinistryDivision(ministryDivisionRepository
                .findByIdAndIsDeleted(agencyDTO.getMinistryDivisionId(), false ).get());
        super.convertForUpdate(agencyDTO, agency);
    }

    // For Getting All Active Agency
    @Override
    public Page<AgencyDTO> getActiveAgency(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<Agency> ePage = repository.findAllByStatusAndIsDeleted(true,false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    @Override
    public ResponseEntity<List<AgencyDTO>> getByMinistryDivisionId(Long ministryDivisionId) {
        return new ResponseEntity<>(convertForRead(repository.findAllByMinistryDivisionIdAndStatusAndIsDeleted(ministryDivisionId, true, false)), HttpStatus.OK);
    }

    @Override
    public AgencyDTO getByNameEn(String nameEn) {
        Agency agency = repository.findByNameEnAndIsDeleted(nameEn, false);
        return agency==null?null:convertForRead(agency);
    }

    public List<AgencyResponseDTO> getActiveData() throws SQLException {

        String SQL = "select id, name_en, name_bn, ministry_division_id, code, status from agency where status = true and is_deleted = false ";
        Connection con = null;
        ResultSet rs = null;
        Statement stm = null;
        List<AgencyResponseDTO> list = new ArrayList<AgencyResponseDTO>();
        try {
            con = getOraConnection();
            stm = con.createStatement();
            rs = stm.executeQuery(SQL);
            while (rs.next()) {

                AgencyResponseDTO a = new AgencyResponseDTO();
                a.setId(rs.getLong("id"));
                a.setNameEn(rs.getString("name_en"));
                a.setNameBn(rs.getString("name_bn"));
                a.setStatus(rs.getBoolean("status"));
                a.setMinistryDivisionId(rs.getLong("ministry_division_id"));
                a.setCode(rs.getString("code"));
                list.add(a);
            }
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (stm != null) {
                    stm.close();
                }
                if (con != null) {
                    con.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return list;
        //return new PageImpl<>(list,  pageable, 15 );

       // return new ResponseEntity<>(convertForRead(repository.findAllByStatusAndIsDeleted(true, false)), HttpStatus.OK);
    }

    @Override
    public AgencyDTO getByCode(String code) {
        Agency agency = repository.findByCodeAndIsDeleted(code, false);
        return agency==null?null:convertForRead(agency);
    }
}


