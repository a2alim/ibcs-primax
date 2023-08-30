package com.ibcs.idsdp.config;


import lombok.Synchronized;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;
import java.util.UUID;

@Component
public class IdGeneratorComponent {

	private final int NUM_CHARS = 4;
	private String chars = "abcdefghijklmonpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	private String otpChars = "0123456789";
	private Random r = new Random();
	private SimpleDateFormat generalFormat = new SimpleDateFormat("yyyyMMdd-HHmmss");
	private final int TRACE_NUM_CHARS = 6;
	private final int OTP_NUM_CHARS = 6;
	private String traceChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
	private SimpleDateFormat traceDateFormat = new SimpleDateFormat("yyMMdd");

	@Synchronized
	public String generateId() {
		Date today = new Date();
		String todayAsString = generalFormat.format(today);
		return todayAsString + "-" + getRandomWord();
	}

	@Synchronized
	public String generateUUID() {
		return UUID.randomUUID().toString();
	}


	@Synchronized
	public String uniqueId() {
		Date today = new Date();
		String todayAsString = generalFormat.format(today);
		return todayAsString + "-" + getRandomWord();
	}

	@Synchronized
	public String fileName() {
		Date today = new Date();
		String todayAsString = generalFormat.format(today);
		return todayAsString + "-" + getRandomWord();
	}

	@Synchronized
	public String generateTraceId() {
		Date today = new Date();
		String todayAsString = traceDateFormat.format(today);
		return todayAsString + getTraceRandomWord();
	}

	@Synchronized
	public String getRandomWord() {
		char[] buf = new char[NUM_CHARS];
		for (int i = 0; i < buf.length; i++) {
			buf[i] = chars.charAt(r.nextInt(chars.length()));
		}
		return new String(buf);
	}

	@Synchronized
	public String getTraceRandomWord() {
		char[] buf = new char[TRACE_NUM_CHARS];
		for (int i = 0; i < buf.length; i++) {
			buf[i] = traceChars.charAt(r.nextInt(traceChars.length()));
		}
		return new String(buf);
	}

	@Synchronized
	public String createOTP() {
		char[] buf = new char[OTP_NUM_CHARS];
		for (int i = 0; i < buf.length; i++) {
			buf[i] = otpChars.charAt(r.nextInt(otpChars.length()));
		}
		return new String(buf);
	}


	@Synchronized
	public int generateRandomNumber() {
		Random rand = new Random();
		return 1000 + rand.nextInt(9000);
	}

	@Synchronized
	public String referenceNo() {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		String todayAsString = calendar.get(Calendar.YEAR) + "/" + (calendar.get(Calendar.MONTH) + 1) + "/"
				+ calendar.get(Calendar.DAY_OF_MONTH) + "/" + (calendar.get(Calendar.HOUR_OF_DAY) + 6);
		return todayAsString + "/" + (10000 + r.nextInt(90000));
	}

	@Synchronized
	public String generateCode(String name, long size) {
		String code = name.substring(0, 2);
		LocalDate date = LocalDate.now();
		String[] part = date.toString().split("-");
		String year = part[0].substring(2, 4);
		String month = part[1];
		String versionListSize = size + 1 + "";
		code = code + "-" + month + "-" + year + "-" + versionListSize;
		return code;
	}
	
}
