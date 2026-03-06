# Capsule reverse proxy container (HTTP-only)
FROM nginxinc/nginx-unprivileged:alpine-slim

USER root
RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

USER nginx
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
