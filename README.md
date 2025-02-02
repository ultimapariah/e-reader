# E-Reader

EPUB reader written in vanilla JavaScript.
Aims to be a convenient way to view .epub files
you have on your device.
Uses [epub.js](https://github.com/futurepress/epub.js/).

# DEVELOPING

- Install [Node.js](https://nodejs.org/en/)
- Clone this repository
- Run `npm install --dev`
- Run `npm run dev` to start nodemon
- Run `npm test` to start the tests with the live server

## THEMES

- Themes can be defined in src/css/themes.css.
- They can be added to the selection by adding its class name to `settingOptions` in State.js.

# TODO

- [ ] Implement `Cypress` for end-to-end testing
- [x] Implement epub reader
  - [x] Use [epub.js](https://github.com/futurepress/epub.js/)
- [x] Implement epub file uploads
  - [x] **Check for specifically epub files with proper format**
  - [x] Drag-and-drop
  - [x] Upload button (HTML)
- [x] Get book metadata
- [x] Store list of previously opened books
  - [x] Use local storage
- [x] Highlights
- [x] Bookmarks
- [ ] Customizable options
  - [x] The functionality that lets you select these
  - [ ] More themes that aren't samples
  - [x] Fonts
  - [x] Speech options
- [x] Table of Contents
- [x] Jump to a given page
  - [x] Jump with page number
  - [x] Page slider
- [x] Remember last read page
- [ ] Reading Progress
  - [x] Percent
  - [ ] Reading Time
- [ ] Search
  - [x] Search in book
  - [ ] Search for a book using metadata
- [x] Library Organization
  - [x] Favorites
  - [ ] Categories _sorta?_
  - [ ] Custom tags
- [x] Modals for alerts?
- [x] Text to Speech


# Tests

This project uses [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/).
Load the page `tests/tests.html` with `live-server` to test.

Write tests in `tests/tests.js`.

# Credits

https://github.com/github/gitignore/blob/main/Node.gitignore - The .gitignore
