FROM ubuntu:15.10

# Packages install
USER root

RUN apt-get update
RUN apt-get -y install default-jre curl wget
RUN apt-get -y install apache2 php5
RUN apt-get -y install git ant mysql-client vim
RUN apt-get -y install git-core zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev
RUN apt-get -y install libgdbm-dev libncurses5-dev automake libtool bison libffi-dev
RUN apt-get -y install php5-mysql php5-curl php5-gd php5-mcrypt php5-xdebug php5-cli

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Composer Install
RUN curl -sS https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer

# Cert
ADD ./ssl.crt /etc/apache2/conf/ssl.crts
ADD ./ssl.key /etc/apache2/conf/ssl.key

ADD ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

RUN apt-get -y install sudo

# Create new user
RUN useradd -u 1000 -m developer
RUN usermod -a -G www-data developer
RUN echo 'developer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
RUN echo 'Defaults !requiretty' >> /etc/sudoers

USER developer
ENV USER developer
ENV TERM xterm

# Node install
ENV NVM_DIR /home/developer/nvm
ENV NODE_VERSION 4.4.7
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v4.4.7/install.sh | bash
RUN source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default && npm install -g gulp bower

CMD ["apachectl"]
