package com.krzyszkowski.loki.mock.core.internal;

import com.krzyszkowski.loki.api.mock.Response;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;

@Component
@Scope(value = "prototype")
public class RuleMatcher {

    private final RuleMatchingExecutor ruleMatchingExecutor;

    private Map<Predicate<HttpServletRequest>, Response> matchingContext;

    public RuleMatcher() {
        ruleMatchingExecutor = new RuleMatchingExecutor();
    }

    public RuleMatchingExecutor searchIn(Map<Predicate<HttpServletRequest>, Response> rules) {
        this.matchingContext = rules;
        return ruleMatchingExecutor;
    }

    public class RuleMatchingExecutor {

        private RuleMatchingExecutor() {
        }

        public Optional<Response> forRuleMatching(HttpServletRequest request) {
            for (var entry : matchingContext.entrySet()) {
                if (entry.getKey().test(request)) {
                    return Optional.ofNullable(entry.getValue());
                }
            }

            return Optional.empty();
        }
    }
}
