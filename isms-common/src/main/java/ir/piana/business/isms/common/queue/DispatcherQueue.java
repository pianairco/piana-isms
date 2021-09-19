package ir.piana.business.isms.common.queue;

import java.lang.annotation.*;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DispatcherQueue {
    String beanName();
    String queueName();
}
