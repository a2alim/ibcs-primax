package com.ibcs.idsdp.util;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Random;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

public interface CommonFunctions {

	default Response getSuccessResponse(String message) {
		Response response = new Response();
		response.setSuccess(true);
		response.setMessage(message);
		return response;
	}

	default Response getSuccessResponse(String message, Response response) {
		response.setSuccess(true);
		response.setMessage(message);
		return response;
	}

	default Response getErrorResponse(String message) {
		Response response = new Response();
		response.setSuccess(false);
		response.setMessage(message);
		return response;
	}

	default Response getErrorResponse(String message, Response response) {
		response.setSuccess(false);
		response.setMessage(message);
		return response;
	}

	String SECURED_READ_SCOPE = "#oauth2.hasScope('read')";

	default String strsingleQuotation(String val) {
		String[] values = val.split(",");
		StringBuilder str = new StringBuilder();
		for (int j = 0; j < values.length; j++) {
			if (j > 0) {
				str.append(",");
			}
			String valuesPattern = "'";
			valuesPattern += values[j];
			valuesPattern += "'";
			str.append(valuesPattern);

		}
		return str.toString();
	}

	String SECURED_WRITE_SCOPE = "#oauth2.hasScope('write')";
	String SECURED_PATTERN = "/api/**";

	@SuppressWarnings("unchecked")
	default <T> List<T> objectMapperReadArrayValue(String mapperArrStr, Class<T> clazz) {
		ObjectMapper objectMapper = new ObjectMapper();
		try {

			return (List<T>) objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
					.readValue(mapperArrStr, TypeFactory.defaultInstance().constructCollectionType(List.class, clazz));

		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}

	long salutationList = 1005l;

	default String buildStr(String str, Map<String, Object> map) {
		String replaceStr = str;
		for (Map.Entry<String, Object> entry : map.entrySet()) {
			if (entry.getValue() instanceof String) {
				replaceStr = replaceStr.replaceAll(entry.getKey(), strsingleQuotation(entry.getValue().toString()));
			} else {
				replaceStr = replaceStr.replaceAll(entry.getKey(), entry.getValue().toString());
			}

		}
		return replaceStr;
	}

	/**
	 * @param str
	 * @param searchStr
	 * @return
	 */
	default boolean containsIgnoreCase(String str, String searchStr) {
		if (str != null) {
			return str.toLowerCase().contains(searchStr.toLowerCase());
		} else {
			return false;
		}

	}

	/**
	 * @param length
	 * @return long
	 */

	default long generateRandom(int length) {
		while (true) {
			long numb = (long) (Math.random() * 100000000 * 1000000);
			if (String.valueOf(numb).length() == length)
				return numb;
		}
	}


	default Date thisWeekFirstDate(Date date) {
		Calendar cal = Calendar.getInstance();
		if (date != null) {
			cal.setTime(date);
		} else {
			cal.setTime(new Date());
		}
		cal.set(Calendar.DAY_OF_WEEK, cal.getActualMinimum(Calendar.DAY_OF_WEEK));
		return cal.getTime();
	}

	default Date thisWeekLastDate(Date date) {
		Calendar calendar = Calendar.getInstance();
		if (date != null) {
			calendar.setTime(date);
		} else {
			calendar.setTime(new Date());
		}
		calendar.set(Calendar.DAY_OF_WEEK, 7);
		return calendar.getTime();
	}

	default Date thisMonthFirstDate(Date date) {
		Calendar cal = Calendar.getInstance();
		if (date != null) {
			cal.setTime(date);
		} else {
			cal.setTime(new Date());
		}
		cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
		return cal.getTime();
	}

	default Date thisMonthLastDate(Date date) {
		Calendar calendar = Calendar.getInstance();
		if (date != null) {
			calendar.setTime(date);
		} else {
			calendar.setTime(new Date());
		}
		calendar.add(Calendar.MONTH, 1); // add one month
		calendar.set(Calendar.DAY_OF_MONTH, 1); // set value day 1
		calendar.add(Calendar.DATE, -1); // minus one date
		return calendar.getTime();
	}

	/**
	 * @param filePath
	 * @return
	 */
	public static File getresoucefile(String filePath) {
		Resource resource = new ClassPathResource(filePath);
		try {
			return resource.getFile();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	default Date thisYearFirstDate() {
		// Current Date
		LocalDate currentDate = LocalDate.now();
		LocalDate date = LocalDate.of(currentDate.getYear(), 01, 01);
		Date thisYearFirstDate = null;
		try {
			thisYearFirstDate = new SimpleDateFormat("yyyy-MM-dd").parse(date.toString());
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return thisYearFirstDate;
	}

	default Date thisYearLastDate() {
		// Current Date
		LocalDate currentDate = LocalDate.now();
		LocalDate date = LocalDate.of(currentDate.getYear(), 12, 31);
		Date thisYearLastDate = null;
		try {
			thisYearLastDate = new SimpleDateFormat("yyyy-MM-dd").parse(date.toString());
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return thisYearLastDate;
	}

	/**
	 * @param file
	 * @return
	 */
	public static byte[] getResouceFileByte(File file) {

		try {
			return FileUtils.readFileToByteArray(file);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

	/**
	 * @param fileByte
	 * @return
	 */
	public static String bytesToBase64String(byte[] fileByte) {

		return Base64.getEncoder().encodeToString(fileByte);
	}

	default Date oneDayPlus(Date date) {
		Date givenDate = date;
		LocalDate localDate = givenDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

		Date oneDayPlusDate = null;
		try {
			oneDayPlusDate = new SimpleDateFormat("yyyy-MM-dd").parse(localDate.plusDays(1).toString());

		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return oneDayPlusDate;
	}

	default Date oneDayPlusClearTime(Date date) {
		Date givenDate = date;
		LocalDateTime localDateTime = givenDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
		Date oneDayPlusDate = Date.from(localDateTime.plusDays(1).atZone(ZoneId.systemDefault()).toInstant());
		return oneDayPlusDate;
	}

	default Date clearTime(Date date) {
		Date givenDate = date;
		LocalDate localDate = givenDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		Date localDateClearTime = null;
		try {
			localDateClearTime = new SimpleDateFormat("yyyy-MM-dd").parse(localDate.toString());
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return localDateClearTime;
	}

	default Date deateParse(String dateStr, String dateFormat) {

		Date parseDate = null;

		try {
			parseDate = new SimpleDateFormat(dateFormat).parse(dateStr);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return parseDate;
	}

	default String dateFormat(Date dateStr, String dateFormat) {
		String parseDate = new SimpleDateFormat(dateFormat).format(dateStr);
		return parseDate;
	}

	/*
	 * default List<PrescriptionDetailsEntity>
	 * getDetailList(List<PrescriptionDetailsEntity> presDetailList, int dataTypeid
	 * ){
	 *
	 * return presDetailList.stream().filter(pd -> pd.getPrescritionDataType() ==
	 * dataTypeid).collect(Collectors.toList()); }
	 *
	 * default PrescriptionDetailsEntity getDatil(List<PrescriptionDetailsEntity>
	 * presDetailList, int dataTypeid ){
	 *
	 * return presDetailList.stream().filter(pd -> pd.getPrescritionDataType() ==
	 * dataTypeid).findFirst().orElse(null); }
	 */

	default BigDecimal convertLongToBigDecimmal(Long logval) {

		if (logval != null) {

			return new BigDecimal(logval);
		}

		return null;
	}

	default BigDecimal convertIntToBigDecimmal(Integer logval) {

		if (logval != null) {

			return new BigDecimal(logval);
		}

		return null;
	}

	default BigDecimal convertFloatToBigDecimmal(Float floatgval) {

		if (floatgval != null) {

			return new BigDecimal(floatgval);
		}

		return null;
	}

	default BigDecimal convertDoubleToBigDecimmal(Double doubleVal) {

		if (doubleVal != null) {

			return new BigDecimal(doubleVal);
		}

		return null;
	}

	default String objectToJson(Object content) {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S"));
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		try {
			return objectMapper.writeValueAsString(content);

		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
		// return null;
	}

	default String procedureQuery(String procedureName, int procedureLength) {

		StringBuilder procdureCall = new StringBuilder();
		procdureCall.append("{call ");
		procdureCall.append(procedureName);
		procdureCall.append("(");

		int totalLenght = procedureLength;

		for (int i = 0; i < totalLenght; i++) {
			procdureCall.append("?");
			if (i != totalLenght - 1) {
				procdureCall.append(",");
			}
		}

		procdureCall.append(")}");

		return procdureCall.toString();
	}

	default Date addHourMinutesSeconds(int hour, int minute, int second, Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);

		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);

		calendar.add(Calendar.HOUR_OF_DAY, hour);
		calendar.add(Calendar.MINUTE, minute);
		calendar.add(Calendar.SECOND, second);

		return calendar.getTime();
	}

	default String imageBase64(byte[] imageValue) {

		if (imageValue != null) {

			return Base64.getEncoder().encodeToString(imageValue);
		}

		return null;
	}

	default String imageBase64(Blob imageValue) {

		return imageBase64(blobToByteArray(imageValue));

	}

	default byte[] blobToByteArray(Blob imgBlob) {

		byte[] imageBytes = null;

		try {
			imageBytes = imgBlob.getBytes(1, (int) imgBlob.length());
			return imageBytes;

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return imageBytes;
		}

	}

	default <T> T objectMapperReadValue(String content, Class<T> valueType) {
		ObjectMapper objectMapper = new ObjectMapper();		
		objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S"));
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		try {

			return objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false).readValue(content,valueType);

		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
		// return null;
	}

	default <T> T objectMapperReadValueWithDate(String content, Class<T> valueType) {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S"));
		try {

			return objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false).readValue(content,valueType);

		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
		// return null;
	}

	@SuppressWarnings("unchecked")
	default <T> List<T> getListFromObject(Object data, Class<T> clazz) {

		if (data == null) {
			return null;
		}

		return (List<T>) data;
	}

	@SuppressWarnings("unchecked")
	default <T> T getValueFromObject(Object data, Class<T> clazz) {
		if (data == null) {
			return null;
		}
		return (T) data;
	}

	default String convertImageToBase64(String filePath) {
		File file = getresoucefile(filePath);
		byte[] bytes = getResouceFileByte(file);
		return bytesToBase64String(bytes);
	}

	default Date getYear(Date dateParam) {
		LocalDate Ldate = LocalDate.of(Integer.parseInt(dateFormat(dateParam, "yyyy")), 0, 0);

		Date date = Date.from(Ldate.atStartOfDay(ZoneId.systemDefault()).toInstant());

		return date;

	}

	default Date thisYearFirstDate(Date date) {

		Calendar calendar = Calendar.getInstance();

		if (date != null) {
			calendar.setTime(date);
		} else {
			calendar.setTime(new Date());
		}
		calendar.set(Calendar.MONTH, 0);
		calendar.set(Calendar.DAY_OF_MONTH, 1);

		return clearTime(calendar.getTime());
	}

	default Date thisYearLastDate(Date date) {

		Calendar calendar = Calendar.getInstance();

		if (date != null) {
			calendar.setTime(date);
		} else {
			calendar.setTime(new Date());
		}
		calendar.set(Calendar.MONTH, 11);
		calendar.set(Calendar.DAY_OF_MONTH, 31);

		return clearTime(calendar.getTime());
	}

	default Date addMinTime(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);

		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);

		return calendar.getTime();
	}

	default Date addMaxTime(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);

		calendar.set(Calendar.HOUR_OF_DAY, 23);
		calendar.set(Calendar.MINUTE, 59);
		calendar.set(Calendar.SECOND, 59);
		calendar.set(Calendar.MILLISECOND, 999);

		return calendar.getTime();
	}

	default boolean isNullOrEmptyOrBlank(String str) {
		return null == str || str.isEmpty() || StringUtils.isBlank(str);
	}

	default java.sql.Date javaUtilDateToSqlDate(java.util.Date date) {
		return new java.sql.Date(date.getTime());
	}

	default String getddmmyyyhhmmss() {
		return new SimpleDateFormat("ddmmyyyhhmmss").format(new Date());
	}

	default String getRandomNumber() {
		Random rnd = new Random();
		int number = rnd.nextInt(999999);
		return String.format("%06d", number);
	}

	default boolean isParsableNumber(String strNumber) {
		Long result = null;
		try {
			result = Long.parseLong(strNumber.trim());
		}

		catch (NumberFormatException exception) {
			return false;
		}

		if (result != null) {
			return true;
		}

		return false;
	}

	default void copyPropertiesEntityToDto(Object sourceObj, Object targetClazz) {
		BeanUtils.copyProperties(sourceObj, targetClazz);
	}

	@SuppressWarnings("unchecked")
	default <T> T copyPropertiesEntityToDto(Object sourceObj, Class<T> targetClazz) {
		Object clazzInstance = null;
		try {
			clazzInstance = targetClazz.newInstance();
			BeanUtils.copyProperties(sourceObj, clazzInstance);
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return (T) clazzInstance;

	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	default <T> List copyPropertiesEntityListToDtoList(List sourceList, Class<T> targetClazz) {

		List arrangedList = new ArrayList<>();

		for (int i = 0; i < sourceList.size(); i++) {

			arrangedList.add(copyPropertiesEntityToDto(sourceList.get(i), targetClazz));
		}

		return arrangedList;

	}

	default AccessTokenDetail tokenDetails() {
		return  (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
	}

}
