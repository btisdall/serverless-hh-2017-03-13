LAMBDA = worker

.PHONY: build
build:
	npm install
	zip -r ${LAMBDA}.js.zip index.js node_modules

.PHONY: upload
upload:
	aws s3 cp ${LAMBDA}.js.zip s3://bentis-dev-271871120138/lambda/${LAMBDA}.js.zip
