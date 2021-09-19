package ir.piana.business.isms.rest;

import ir.piana.business.isms.common.queue.DispatcherQueue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.DependsOn;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.jms.Queue;
import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@DependsOn("ActiveMQSpec")
@DispatcherQueue(beanName = "asyncTestRestQueue", queueName = "piana.http.dispatcher.queue")
public class AsyncTestRest {
    protected final Map<String, AsyncContext> httpRequestExchangeMap = new LinkedHashMap<>();

    @Autowired
    private JmsTemplate jmsTemplate;

    @Autowired
    @Qualifier("asyncTestRestQueue")
    private Queue httpRequestQueue;

    ExecutorService executorService;

    @PostConstruct
    public void init() {
        executorService = Executors.newFixedThreadPool(3);
    }

    @GetMapping(path = "async/test")
    public void asyncTest(HttpServletRequest request, HttpServletResponse response) {
        AsyncContext asyncContext = request.startAsync(request, response);

//        ServletContext appScope = request.getServletContext();
//        ((java.util.Queue<AsyncContext>)appScope.getAttribute("slowWebServiceJobQueue")).add(asyncContext);

        String uuid = UUID.randomUUID().toString();
        httpRequestExchangeMap.put(uuid, asyncContext);
        jmsTemplate.convertAndSend(httpRequestQueue, uuid);
    }

    @JmsListener(destination = "piana.http.dispatcher.queue")
    public void listen(String uuid) throws IOException {
        AsyncContext asyncContext = httpRequestExchangeMap.remove(uuid);

        executorService.execute(() -> {
            try {
                this.handle(asyncContext);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    public void handle(AsyncContext asyncContext) throws IOException {
        asyncContext.getResponse().getWriter().write("hello async test");
        asyncContext.complete();
    }
}
