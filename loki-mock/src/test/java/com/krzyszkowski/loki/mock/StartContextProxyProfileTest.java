package com.krzyszkowski.loki.mock;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@ActiveProfiles("proxy")
public class StartContextProxyProfileTest {

    @Test
    public void contextLoads() {
        // intentionally left empty
    }
}
