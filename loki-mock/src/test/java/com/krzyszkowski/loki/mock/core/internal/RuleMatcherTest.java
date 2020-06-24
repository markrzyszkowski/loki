package com.krzyszkowski.loki.mock.core.internal;

import com.krzyszkowski.loki.api.mock.Response;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.function.Predicate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("static")
class RuleMatcherTest {

    @Autowired
    private ObjectFactory<RuleMatcher> ruleMatcherFactory;

    @Test
    void searchWithEmptyRules() {
        // given
        var rules = Map.<Predicate<HttpServletRequest>, Response>of();
        var request = new MockHttpServletRequest();

        // when
        var result = ruleMatcherFactory.getObject()
                                       .searchIn(rules)
                                       .forRuleMatching(request);

        // then
        assertThat(result).isEmpty();
    }

    @Test
    void searchWithNoMatchingRules() {
        // given
        var rules = Map.<Predicate<HttpServletRequest>, Response>of(httpServletRequest -> false, new Response());
        var request = new MockHttpServletRequest();

        // when
        var result = ruleMatcherFactory.getObject()
                                       .searchIn(rules)
                                       .forRuleMatching(request);

        // then
        assertThat(result).isEmpty();
    }

    @Test
    void searchWithMatchingRule() {
        // given
        var rules = Map.<Predicate<HttpServletRequest>, Response>of(httpServletRequest -> true, new Response());
        var request = new MockHttpServletRequest();

        // when
        var result = ruleMatcherFactory.getObject()
                                       .searchIn(rules)
                                       .forRuleMatching(request);

        // then
        assertThat(result).isPresent();
    }
}
