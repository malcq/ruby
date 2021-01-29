# Lotto Mansion

## Requirements

* Docker CE installed for [ubuntu](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/) or [windows](https://docs.docker.com/docker-for-windows/install/)
* [Docker compose](https://docs.docker.com/compose/install/)

# Setup environment variables

## UI

1. Create `.env` file inside `ui` directory

2. Add the following variables:

```
REACT_APP_API_HOST=<server_host> (localhost)
REACT_APP_API_PORT=<server_port> (8080)
REACT_APP_API_HTTPS=false
REACT_APP_API_BASE_PATH=/api/v1
REACT_APP_API_WITH_CREDENTIALS=true

```

## Server

1. Create `.env` file in the root directory

2. Add the following variables:

```
FRONT_HOSTNAME=<ui_hostname> (localhost)
FRONT_PORT=<ui_port> (3000)
HTTPS=false
SESSION_SECRET=<some_long_string>

POSTGRES_HOST=postgres
POSTGRES_USER=lotto-mansion
POSTGRES_DB=lotto-mansion
POSTGRES_PASSWORD=<your_password>

MAIL_HOST=<mail_provider_host> (smtp.gmail.com)
MAIL_PORT=<mail_provider_port> (587 for gmail)
MAIL_USER=<your_email>
MAIL_PASS=<your_email_pass>
MAIL_FROM='"Lotto Mansion" <noreply@lottomansion.com>'
```

# Docker commands (development)

Run containers in the background:

```
$ docker-compose up -d
```

Show and follow containers logs:

```
$ docker-compose logs -f
```

Stop containers:

```
$ docker-compose down
```

Connect to a container:

(`container_name` is for example `lotto-mansion-db`)

```
$ docker exec -ti <container_name> bash
```

# Production

Run from the root folder:

```
# ./docker-runner-prod
```
