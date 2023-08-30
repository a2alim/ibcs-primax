package com.ibcs.idsdp.common.services;

import java.lang.reflect.ParameterizedType;
import java.math.BigInteger;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.util.CollectionUtils;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.common.web.dto.request.IUuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.util.CommonFunctions;
import com.ibcs.idsdp.util.Response;

import lombok.NonNull;

public abstract class BaseService<E extends BaseEntity, I extends IUuidIdHolderRequestBodyDTO, O>	implements CommonFunctions {

	Logger logger = LoggerFactory.getLogger(BaseService.class);

	@Autowired
	private IdGeneratorComponent idGeneratorComponent;

	@Autowired
	private DataDependencyService dataDependencyService;

	@Autowired
	private EntityManagerFactory entityManagerFactory;

	private ModelMapper modelMapper;

	private final ServiceRepository<E> repository;
	private final Logger LOGGER = LoggerFactory.getLogger(BaseService.class);

	private static final int DEFAULT_PAGE_SIZE = 1000000;

	@Autowired
	private Environment env;

	protected BaseService(ServiceRepository<E> repository) {
		this.repository = repository;
		modelMapper = new ModelMapper();
		modelMapper.getConfiguration().setAmbiguityIgnored(true);
	}

	public Response<O> getList() {

		Response<O> response = new Response();

		List<O> list = null;
		try {
			list = convertForRead(repository.findAllByIsDeleted(false));

			if (list.size() > 0) {
				response.setItems(list);
				return getSuccessResponse("Data found ", response);
			}

			return getSuccessResponse("Data Empty ");
		} catch (Exception e) {
			logger.error(e.getMessage());
			return getErrorResponse("Data not found !!");
		}
	}

	public Response<O> getList(PageableRequestBodyDTO requestBodyDTO) {

		Response<O> response = new Response();
		Pageable pageable = this.getPageable(requestBodyDTO);
		Page<E> ePage = null;

		try {
			ePage = repository.findAllByIsDeletedOrderByIdDesc(false, pageable);

			if (!CollectionUtils.isEmpty(ePage.getContent())) {
				response.setPage(new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements()));

				return getSuccessResponse("Data found ", response);
			}
			return getSuccessResponse("Data Empty ");

		} catch (Exception e) {
			logger.error(e.getMessage());
			return getErrorResponse("Data not found !!");
		}
	}

	public Response<O> getByUuid(@NonNull String uuid) {

		Response<O> response = new Response();
		O obj = null;
		try {
			Optional<E> e = repository.findByUuidAndIsDeleted(uuid, false);

			if (e.isPresent()) {
				obj = convertForRead(e.get());
				response.setObj(obj);
				return getSuccessResponse("find data Successfully", response);
			}

			return getErrorResponse("Data Not Found !");

		} catch (NoResultException e) {
			logger.error(e.getMessage());
			return getErrorResponse("Data not Found !!");
		} catch (Exception e) {
			logger.error(e.getMessage());
			return getErrorResponse("exception occurred !!");
		}
	}

	public Response<O> getByUuids(Set<String> uuids) {

		Response<O> response = new Response();
		List<E> list = null;

		try {
			list = repository.findAllByUuidInAndIsDeleted(uuids, false);

			if (list.size() > 0) {
				response.setItems(convertForRead(list));
				return getSuccessResponse("Data found ", response);
			}
			logger.info("Data list size is 0");
			return getSuccessResponse("Data Empty ");
		} catch (Exception e) {
			logger.error(e.getMessage());
			return getErrorResponse("Data not found !!");
		}
	}

	public Response<O> getById(@NonNull Long id) {
		Response<O> response = new Response();
		O obj = null;

		try {
			Optional<E> e = repository.findByIdAndIsDeleted(id, false);
			if (e.isPresent()) {
				obj = convertForRead(e.get());
				response.setObj(obj);
				return getSuccessResponse("find data Successfully", response);
			}
			return getErrorResponse("Data Not Found !");

		} catch (NoResultException e) {
			logger.error(e.getMessage());
			return getErrorResponse("Data not Found !!");
		} catch (Exception e) {
			logger.error(e.getMessage());
			return getErrorResponse("exception occured !!");
		}
	}

	public Response<O> getByIds(Set<Long> ids) {

		Response<O> response = new Response();
		List<E> list = null;
		try {
			list = repository.findAllByIdInAndIsDeleted(ids, false);

			if (list.size() > 0) {
				response.setItems(convertForRead(list));
				return getSuccessResponse("Data found ", response);
			}
			logger.info("Data list size is 0");
			return getSuccessResponse("Data Empty ");

		} catch (Exception e) {
			logger.error(e.getMessage());
			return getErrorResponse("Data not found !!");
		}
	}

	public Response<O> create(I i) {
		Response<O> response = new Response();
		try {
			response.setObj(convertForRead(createEntity(i)));
			return getSuccessResponse("Created Successfully", response);
		} catch (Exception e) {
			logger.error(e.getMessage());
			return getErrorResponse("Save failed !!");
		}
	}

	public Response<O> update(I i) {
		Response<O> response = new Response();
		try {
			response.setObj(convertForRead(updateEntity(i)));
			return getSuccessResponse("Updated Successfully", response);
		} catch (Exception e) {
			logger.error(e.getMessage());
			return getErrorResponse("Save failed !!");
		}
	}

	public BooleanValueHolderDTO delete(@NonNull String oid) {
		deleteEntity(oid);
		BooleanValueHolderDTO booleanValueHolderDTO = new BooleanValueHolderDTO();
		try {
			booleanValueHolderDTO.setSuccess(true);
			booleanValueHolderDTO.setMessage("Deleted Successfully");
			return booleanValueHolderDTO;
		} catch (Exception exception) {
			booleanValueHolderDTO.setSuccess(false);
			booleanValueHolderDTO.setMessage("Delete failed !!");
			return booleanValueHolderDTO;
		}

		/*
		 * return new BooleanValueHolderDTO() { { setSuccess(true);
		 * setMessage("Deleted Successfully"); } };
		 */
	}
	// safe delete

	public BooleanValueHolderDTO safeDdelete(@NonNull String oid, String key, String columnName) {
		if (oid == null)
			throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException(
					"No Id Provided for " + getEntityClass().getSimpleName());
		E e = getByUuidForRead(oid);

		boolean res = dataDependencyService.isDeleletable(key, columnName, e.getId());
		BooleanValueHolderDTO booleanValueHolderDTO = new BooleanValueHolderDTO();
		if (res) {
			deleteEntity(oid);

			try {
				booleanValueHolderDTO.setSuccess(true);
				booleanValueHolderDTO.setMessage("Deleted Successfully");
				return booleanValueHolderDTO;
			} catch (Exception exception) {
				booleanValueHolderDTO.setSuccess(false);
				booleanValueHolderDTO.setMessage("Delete failed !!");
				return booleanValueHolderDTO;
			}
		} else {
			booleanValueHolderDTO.setSuccess(false);
			booleanValueHolderDTO.setMessage("This Data used in another service !!");
			return booleanValueHolderDTO;
		}

	}

	protected E createEntity(I body) {

		E e = convertForCreate(body);
		e.setUuid(idGeneratorComponent.generateUUID());
//		e.setCreatedBy("user");
//		e.setCreatedOn(LocalDate.now());
//		e.setIsDeleted(false);
//		e.setUpdatedBy("user");
		return repository.save(e);
	}

	protected E updateEntity(I body) {
		String uuid = body.getUuid();
		if (uuid == null)
			throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException(
					"No Id Provided for " + getEntityClass().getSimpleName());
		E e = getByUuidForRead(uuid);
		body.setId(e.getId());
		convertForUpdate(body, e);
//		e.setUpdatedBy("user");
		e.setUpdatedOn(LocalDate.now());
		e.setIsDeleted(false);
//		e.setUpdatedBy("user");
		return repository.save(e);
	}

	protected void deleteEntity(String id) {
		if (id == null)
			throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException(
					"No Id Provided for " + getEntityClass().getSimpleName());
		E e = getByUuidForRead(id);
		e.setIsDeleted(true);
		e.setUpdatedOn(LocalDate.now());
//		e.setUpdatedBy("user");
		repository.save(e);
	}

	public E getByUuidForRead(@NonNull String oid) {
		return repository.findByUuidAndIsDeleted(oid, false).orElse(null);
	}

	protected O convertForRead(E e) {
		return modelMapper.map(e, getResponseDtoClass());
	}

	protected List<O> convertForRead(List<E> e) {
		return e.stream().map(this::convertForRead).collect(Collectors.toList());
	}

	protected E convertForCreate(I i) {
		return modelMapper.map(i, getEntityClass());
	}

	protected void convertForUpdate(I i, E e) {
		BeanUtils.copyProperties(i, e);
	}

	@SuppressWarnings("unchecked")
	private Class<E> getEntityClass() {
		return (Class<E>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
	}

	@SuppressWarnings("unchecked")
	private Class<I> getDtoClass() {
		return (Class<I>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
	}

	@SuppressWarnings("unchecked")
	private Class<O> getResponseDtoClass() {
		return (Class<O>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[2];
	}

	public Pageable getPageable(PageableRequestBodyDTO requestDTO) {
		PageableRequestBodyDTO pageSettings = new PageableRequestBodyDTO() {
			{
				setPage(0);
				setSize(DEFAULT_PAGE_SIZE);
			}
		};
		if (requestDTO != null && requestDTO.getPage() != null && requestDTO.getSize() != null) {
			pageSettings = requestDTO;
		}
		return PageRequest.of(pageSettings.getPage(), pageSettings.getSize());
	}

	public Boolean isExistsBeforeSave(String tableName, String columnName, String value) {

		String query = "SELECT COUNT(" + columnName + ") FROM " + tableName + " WHERE " + tableName + "." + columnName
				+ " = '" + value + "' AND is_deleted=false";
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		Query nativeQuery = entityManager.createNativeQuery(query);
		BigInteger result = (BigInteger) nativeQuery.getSingleResult();

		if (result != null && result == BigInteger.ZERO) {
			return false;
		}

		System.out.println("result ==== > " + result);
		return true;
	}

	public Boolean isExistsBeforeUpdate(String tableName, String columnName, Long id, String value) {

		String query = "SELECT COUNT(" + columnName + ") FROM " + tableName + " WHERE " + tableName + "." + columnName
				+ " = '" + value + "' and id <> " + id + " AND is_deleted=false";
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		Query nativeQuery = entityManager.createNativeQuery(query);
		BigInteger result = (BigInteger) nativeQuery.getSingleResult();

		if (result != null && result == BigInteger.ZERO) {
			return false;
		}

		System.out.println("result ==== > " + result);
		return true;
	}

	public Connection getOraConnection() {

		String driverClassName = env.getProperty("spring.datasource.driver-class-name");
		String url = env.getProperty("spring.datasource.url");
		String username = env.getProperty("spring.datasource.username");
		String password = env.getProperty("spring.datasource.password");
		
//		System.out.println("driver class name ==== >>>> " + driverClassName);
//		System.out.println("url === >>> " + url);
//		System.out.println("username ==== >>>> " + username);
//		System.out.println("password ==== >>>> " + password);

		try {
			Class.forName(env.getProperty("spring.datasource.driver-class-name"));

		} catch (ClassNotFoundException e) {
			System.out.println("Where is your Oracle JDBC Driver?");
		}

		Connection connection = null;

		try {
			connection = DriverManager.getConnection(env.getProperty("spring.datasource.url"),env.getProperty("spring.datasource.username"), env.getProperty("spring.datasource.password"));

		} catch (SQLException e) {
			System.out.println("Connection Failed! Check output console");
		}
		if (connection != null) {
			return connection;

		} else {
			System.out.println("Failed to make connection!");
			return null;
		}

	}

}
