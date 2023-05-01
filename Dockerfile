FROM nginx:alpine

COPY nginx_linux_no_ssl.conf /etc/nginx/nginx.conf 
COPY ./build/ /var/www/netbanking
#COPY ./.keys/* /var/www/netbanking
EXPOSE 3000

