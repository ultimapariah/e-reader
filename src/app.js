import Library from './Library.js';
import LibItem from './LibItem.js';
import { initializeModals, attachModal, debounce } from './Utils.js';

const toast = Toastify({
  text: "Loaded Library.",
  duration: 3000,
  close: true,
  gravity: "top",
  position: "center",
  style: {
    background: "black",
    color: "white",
    "font-family": "Arial, sans-serif",
  },
});

///// FUNCTIONS /////

/**
 * @param {ArrayBuffer|String} bookData
 * @param {Array} bookLib The global list of books in library
 * @param {String} category The inserted book's category ('Library', 'Favorites', etc.)
 */
function storeBookToLib(bookData, bookLib, category) {
  const itemToSave = new LibItem(bookData);
  if (!bookLib[category])
    bookLib[category] = [];

  bookLib[category].push(itemToSave);
}

/**
 * Hacky workaround to pass the array of books in the library
 * to the individual book state.
 * Use by executing the function when passed as
 * parameter to an event "openBookEvent()"
 * @param {Lib} Library
 * @returns {Function} Event to be used on a file upload trigger
 */
function openBookEvent(Library) {
  return e => {
    if (!window.FileReader) return null;
    if (e.target.files.length === 0) return null;

    const file = e.target.files[0];
    loadFileAsEpub(file, Library);
  }
}

//// HTML ELEMENTS /////

const $modal = document.querySelector('#modal');
const $library = document.querySelector('#library');
const $file_upload = document.querySelector('#file-upload');
const $file_upload_container = document.querySelector('.file-upload-container');

const $storage_usage = document.querySelector('#usage');
const $storage_quota = document.querySelector('#quota');
const $storage_percent = document.querySelector('#percent');
const $storage_clear = document.querySelector('#clear-storage');

// const $drop_zone = document.querySelector('.drop-zone');
const $body = document.body;
let dragTimeoutFunction;
const dragTimeoutCounter = 3000;

///// MAIN /////
const Lib = new Library($library, $storage_usage, $storage_quota, $storage_percent);

$file_upload.onchange = openBookEvent(Lib);
$storage_clear.onclick = clearLibrary;
// $drop_zone.ondragover = dropZoneDragOver;
// $drop_zone.ondrop = dropZoneOnDrop;
initDragAndDrop();

// Load the books from storage and populate the library div
(async () => {
  await Lib.init();
  Lib.refreshLibraryDisplay($library);
  toast.showToast();
})();

async function clearLibrary() {
  let value = null;

  try {
    value = await localforage.removeItem('Library');
    Lib.bookLib = [];
  } catch(err) {
    console.log(err);
  }

  Lib.refreshLibraryDisplay();

  toast.options.text = 'Library cleared.';
  toast.showToast();

  return value;
}

function dropZoneDragOver(e) {
  console.log('File in drop zone');

  e.preventDefault();
}

function dropZoneOnDrop(e) {
  console.log('File dropped');

  e.preventDefault();

  $file_upload_container.classList.remove("file-upload-file-is-hovered");

  if (!e.dataTransfer.items) throw 'No items dropped.';
  if (e.dataTransfer.items.length !== 1) throw 'Please upload one item only.';
  if (e.dataTransfer.items[0].kind !== 'file') throw 'Dropped item was not a file.';
  if (e.dataTransfer.items[0].type !== 'application/epub+zip') throw 'Dropped item was not an epub.';

  const file = e.dataTransfer.items[0].getAsFile();
  loadFileAsEpub(file, Lib);
}

function initDragAndDrop() {
  const debouncedRemove = debounce(() => {
  });

  document.ondragenter = (e => {
    console.log('Dragging on body');
    e.preventDefault();

    $file_upload_container.classList.add("file-upload-file-is-hovered");
  });

  // Removes the css class when window enters focus.
  // NOTE: I am relying on the possibility that the user's
  // window is not focused when dragging a file.
  // This is a very performant method to achieve the css change given this.
  window.onfocus = e => {
    $file_upload_container.classList.remove("file-upload-file-is-hovered");
    e.preventDefault();
  }

  $file_upload_container.ondragover = dropZoneDragOver;

  $file_upload_container.ondrop = dropZoneOnDrop;

}

function loadFileAsEpub(file) {
  const reader = new FileReader();


  // Executes after readAsArrayBuffer finishes
  reader.onload = bookData => {
    storeBookToLib(bookData.target.result, Lib.bookLib, "Library");

    // Need to execute the functions directly after uploading a book
    // Async await does not work here, apparently, so we use 'then'
    // to make these async functions execute one after the other
    Lib.saveLibrary().then(() => {
      Lib.refreshLibraryDisplay();
    });
    toast.options.text = 'Added book to library.';
    toast.showToast();
  };

  reader.readAsArrayBuffer(file);

}

initializeModals('modal-container', 'modal-close');

console.log('Loaded index');

