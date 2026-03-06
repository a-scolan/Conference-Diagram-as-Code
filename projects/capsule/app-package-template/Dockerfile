# Use the unprivileged alpine-slim version for smallest size (~10MB) and best security
FROM nginxinc/nginx-unprivileged:alpine-slim

# Switch to root temporarily to clean default files
USER root

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy your static HTML files to the container
# Assuming your files are in a local directory named 'public'
COPY ./public /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Switch back to the non-root user 'nginx' for runtime security
USER nginx

# Expose port 8080 (Unprivileged users cannot bind to ports < 1024)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
