package com.krzyszkowski.loki.mock.core.internal;

import com.krzyszkowski.loki.api.mock.Rule;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@Component
@Scope(value = "prototype")
public class RuleMatcher {

    private final RuleMatchingExecutor ruleMatchingExecutor;

    private List<Rule> matchingContext;

    public RuleMatcher() {
        ruleMatchingExecutor = new RuleMatchingExecutor();
    }

    public RuleMatchingExecutor searchIn(List<Rule> rules) {
        this.matchingContext = rules;
        return ruleMatchingExecutor;
    }

    public class RuleMatchingExecutor {

        private RuleMatchingExecutor() {
        }

        public Optional<Rule> forRuleMatching(HttpServletRequest request) {
            return Optional.ofNullable(matchingContext.get(0));
        }
    }
}
