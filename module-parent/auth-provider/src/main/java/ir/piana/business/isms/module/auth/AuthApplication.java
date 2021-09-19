package ir.piana.business.isms.module.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthApplication {

	public static void main(String[] args) {
//		System.out.println(UUID.randomUUID().toString().length());
		SpringApplication.run(AuthApplication.class, args);
	}

}
