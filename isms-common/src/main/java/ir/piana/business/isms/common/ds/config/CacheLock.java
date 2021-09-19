package ir.piana.business.isms.common.ds.config;

import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
class CacheLock {
    private Lock lock = new ReentrantLock();

    boolean doSynchronized(int second, boolean force, Runnable runnable) {
        boolean isLocked = false;
        try {
            do {
                try {
                    isLocked = lock.tryLock(second, TimeUnit.SECONDS);
                } catch (InterruptedException e) {
                    if (!force)
                        return false;
                }
            } while (!isLocked && force);
            runnable.run();
            return true;
        } catch (Exception e) {
            return false;
        } finally {
            if(isLocked)
                lock.unlock();
        }
    }
}
