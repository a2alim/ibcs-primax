package com.ibcs.idsdp.common.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.math.BigInteger;
import java.util.List;

@Service
@PropertySource("classpath:data_dependency_table.properties")
public class DataDependencyService {
    @Autowired
    private Environment environment;
    @Autowired
    private EntityManagerFactory entityManagerFactory;

    public List<String> getfilteredTable(String key) {
        List<String> listOfStrings = null;
        try {
            listOfStrings = (List<String>) environment.getProperty(key, List.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listOfStrings;

    }


    public Boolean isSafeForDelete(List<String> tableList, String columnName, Long id) {
        boolean res = true;
        try {
            for (String tableName : tableList) {
                String query = "SELECT COUNT(" + columnName + ") FROM " + tableName + " WHERE " + tableName + "." + columnName + " = " + id + " AND is_deleted=false";
                EntityManager entityManager = entityManagerFactory.createEntityManager();
                Query nativeQuery = entityManager.createNativeQuery(query);
                BigInteger result = (BigInteger) nativeQuery.getSingleResult();
                if (result != null && result != BigInteger.ZERO) {
                    res = false;
                    break;
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return res;
    }


    public boolean isDeleletable(String key,String columnName,Long id) {
        List<String> table = getfilteredTable(key);
        boolean response=isSafeForDelete(table,columnName,id);

        return response;

    }

}
