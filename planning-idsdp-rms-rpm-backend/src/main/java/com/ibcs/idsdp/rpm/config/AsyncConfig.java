package com.ibcs.idsdp.rpm.config;

/**
 * @author rakibul.hasan
 * @create 10/13/2021
 * @github `https://github.com/rhmtechno`
 */
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "profileExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(10);
        executor.setThreadNamePrefix("View Worker-");
        executor.initialize();
        return executor;
    }

}