IMAGE = nginx:latest

.PHONY: nginxrun

nginxrun:
	docker run -v `pwd`/nginx/html:/usr/share/nginx/html -p 8080:80 ${IMAGE}

