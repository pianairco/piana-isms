package ir.piana.business.isms.common.queue;

import lombok.extern.slf4j.Slf4j;
import org.apache.activemq.command.ActiveMQQueue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.web.context.support.GenericWebApplicationContext;
import org.springframework.web.context.support.StandardServletEnvironment;

import java.util.LinkedHashMap;
import java.util.Set;

@EnableJms
@Configuration
@Slf4j
public class ActiveMQConfiguration {
    @Autowired
    private GenericWebApplicationContext context;

    @Bean("ActiveMQSpec")
    public ActiveMQSpec getActiveMQSpec() {
        AutowireCapableBeanFactory factory = context.getAutowireCapableBeanFactory();
        BeanDefinitionRegistry registry = (BeanDefinitionRegistry) factory;
//        registry.removeBeanDefinition("myBean");
//        ActiveMQQueue activeMQQueue = new ActiveMQQueue("piana.http.dispatcher.queue");

        final ClassPathScanningCandidateComponentProvider provider = new ClassPathScanningCandidateComponentProvider(
                true, new StandardServletEnvironment());
        provider.addIncludeFilter(new AnnotationTypeFilter(DispatcherQueue.class));
        Set<BeanDefinition> candidateComponents = provider.findCandidateComponents("ir.piana");
        ActiveMQSpec activeMQSpec = new ActiveMQSpec(new LinkedHashMap<>());
        for(BeanDefinition beanDefinition: candidateComponents) {
            try {
                Class<?> targetClass = Class.forName(beanDefinition.getBeanClassName());
                DispatcherQueue annotation = (DispatcherQueue)targetClass.getAnnotation(DispatcherQueue.class);
                if(annotation != null) {
                    String queueName = annotation.queueName();
                    String beanName = annotation.beanName();
//                "piana.http.dispatcher.queue"
                    context.registerBean(beanName, ActiveMQQueue.class, () -> {
                        ActiveMQQueue activeMQQueue = new ActiveMQQueue(queueName);
                        activeMQSpec.queueMap.put(beanName, activeMQQueue);
                        return activeMQQueue;
                    });
                }
            } catch (ClassNotFoundException e) {
                log.warn("Could not resolve class object for bean definition", e);
            }
        }

//        ActiveMQSpec activeMQSpec = new ActiveMQSpec(new LinkedHashMap<>());
//        Reflections reflections = new Reflections();
//        Set<Class<?>> typesAnnotatedWith = reflections
//                .getTypesAnnotatedWith(DispatcherQueue.class);
//        if(typesAnnotatedWith != null && !typesAnnotatedWith.isEmpty()) {
//            for (Class targetClass : typesAnnotatedWith) {
//                DispatcherQueue annotation = (DispatcherQueue)targetClass.getAnnotation(DispatcherQueue.class);
//                String queueName = annotation.queueName();
//                String beanName = annotation.beanName();
////                "piana.http.dispatcher.queue"
//                context.registerBean(beanName, ActiveMQQueue.class, () -> {
//                    ActiveMQQueue activeMQQueue = new ActiveMQQueue(queueName);
//                    activeMQSpec.queueMap.put(beanName, activeMQQueue);
//                    return activeMQQueue;
//                });
//            }
//        }
        return activeMQSpec;
    }

//    @Bean
//    @Primary
//    public Queue dispatchHttpRequestQueue(){
//        ActiveMQQueue activeMQQueue = new ActiveMQQueue("piana.http.dispatcher.queue");
//        return activeMQQueue;
//    }
}
