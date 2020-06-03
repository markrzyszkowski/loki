package com.krzyszkowski.loki.mock.core.internal;

import com.krzyszkowski.loki.mock.core.internal.util.ResultHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.async.DeferredResult;

import java.time.Instant;
import java.util.Comparator;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.PriorityBlockingQueue;

@Component
public class ResultQueueManager<T> {

    private BlockingQueue<Result<T>> results = new PriorityBlockingQueue<>(1000, new Result.ResultComparator());

    public void submit(Instant dispatchTime, T response, DeferredResult<T> deferredResult) {
        results.offer(new Result<T>(dispatchTime, response, deferredResult));
    }

    @Scheduled(fixedRate = 100)
    private void dispatch() {
        Result<T> result;
        while ((result = results.peek()) != null) {
            if (ResultHelper.shouldReturn(result.dispatchTime)) {
                result.deferredResult.setResult(result.response);

                results.poll(); // remove element
            } else {
                break;
            }
        }
    }

    private static class Result<T> {

        private Instant dispatchTime;
        private T response;
        private DeferredResult<T> deferredResult;

        public Result(Instant dispatchTime, T response, DeferredResult<T> deferredResult) {
            this.dispatchTime = dispatchTime;
            this.response = response;
            this.deferredResult = deferredResult;
        }

        private static class ResultComparator implements Comparator<Result<?>> {

            @Override
            public int compare(Result<?> a, Result<?> b) {
                return a.dispatchTime.compareTo(b.dispatchTime);
            }
        }
    }
}
