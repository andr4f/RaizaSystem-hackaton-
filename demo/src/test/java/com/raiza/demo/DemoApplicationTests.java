package com.raiza.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = MagdalenaTraceApplication.class)
@ActiveProfiles("test")
class DemoApplicationTests {

	@Test
	void contextLoads() {
	}

}
