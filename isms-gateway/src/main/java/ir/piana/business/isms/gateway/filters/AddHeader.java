package ir.piana.business.isms.gateway.filters;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class AddHeader
        extends AbstractGatewayFilterFactory<AddHeader.HeaderMap> {
    public AddHeader() {
        super(AddHeader.HeaderMap.class);
    }

    @Override
    public AddHeader.HeaderMap newConfig() {
        return new HeaderMap();
    }

    @Override
    public List<String> shortcutFieldOrder() {
        return Arrays.asList("name", "value");
    }

    @Override
    public GatewayFilter apply(HeaderMap config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest().mutate()
                    .header("myheader", "ali")
                    .header(config.name, config.value)
                    .build();

            return chain.filter(exchange.mutate().request(request).build());
        };
    }

    public static class HeaderMap {
        private String name;
        private String value;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }
    }
}
