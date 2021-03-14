# Scribd Downloader using Puppeteer

**WARNING REPO DEPRECIATED**

### General information

Please keep in mind the following:

- It will only download audiobooks
- It requires you to have a premium account
- I will not be mantaining this repo.

### Downloading and installing dependencies

You must install:

- nodeJS (I run v15.4.0)
- Git

Once you have those dependencies installed download this repo in your prefered way.

Inside the top directory run the command:

```
$ npm install
```

Then do the following actions:

1. Create a config.env file with the following content (no spaces)

```
SCRIBD_USERNAME=your_username
SCRIBD_PASSWORD=your_password
```

2. Fill out scridb_urls.json (this is a json list of audio books to download)

### Usage

In the top directory run

```
$ node cli.js
```

Downloaded files are stored in the downloads folder (Programm will create a new folder for each book)

Files are named by their corresponding number (based on correct audiobook sequence). In some cases, duplicates may be downloaded, in which case -copy will be added to show that it is a copy (this may happen multiple times).

### Disclaimer

Downloading books from Scribd for free maybe prohibited. This tool is meant for educational purposes only. Please support the authors by buying their titles.

### License

`The MIT License`
