//Comments for my thought process so I dont forget:
//Declare an array for library to store the books. //create a function to create books. //User should be able to add and remove books.
// Every book should have a unique id - generated through crypto.randomUUID().
//Every book (object) should have a title, author, pages, read status (read or unread) and unique id attributes.
//Features: 1) Search Books, 2) Filter: All, read, unread., 3) Sort: TItle, author, pages.
//4) Local storage persistance., 5) Empty library state, 6) Modern form.

const library = [];
const libraryDiv = document.querySelector("#library");
const dialog = document.querySelector("#book-dialog");
const form = document.querySelector("#book-form");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const pagesInput = document.querySelector("#pages");
const readInput = document.querySelector("#read");
const searchInput = document.querySelector("#search");
const filterInput = document.querySelector("#filter");
const sortInput = document.querySelector("#sort");




class Book {
    constructor(title, author, pages, read) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

function addBook(book) {
    library.push(book);
    saveBooks();
    renderBooks();
}
function removeBook(id) {
    const index = library.findIndex(book => book.id === id);
    library.splice(index, 1);
    saveBooks();
    renderBooks();
}

function toggleRead(id) {
    const book = library.find(book => book.id === id);

    book.read = !book.read;

    saveBooks();
    renderBooks();
}

function renderBooks() {

    libraryDiv.innerHTML = "";

    let books = [...library];
    const search = searchInput.value.toLowerCase();

    books = books.filter(book =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search)
    );

    if (filterInput.value === "read") {
        books = books.filter(book => book.read);
    }

    if (filterInput.value === "unread") {
        books = books.filter(book => !book.read);
    }

    if (sortInput.value) {
        books.sort((a, b) => {

            if (sortInput.value === "pages") {
                return a.pages - b.pages;
            }

            return a[sortInput.value]
                .localeCompare(b[sortInput.value]);

        });
    }

    if (books.length === 0) {
        libraryDiv.innerHTML = "<p>No books found.</p>";
        return;
    }

    books.forEach(book => {

        const card = document.createElement("div");

        card.classList.add("book");
        card.innerHTML = `
            <h2>${book.title}</h2>
            <p>${book.author}</p>
            <p>${book.pages} pages</p>
            <p>${book.read ? "Read" : "Not read yet"}</p>

            <button class="toggle">Toggle Read</button>
            <button class="delete">Remove</button>
        `;

        card.querySelector(".delete")
            .addEventListener("click", () => {
                removeBook(book.id);
            });


        card.querySelector(".toggle")
            .addEventListener("click", () => {
                toggleRead(book.id);
            });

        libraryDiv.appendChild(card);

    });
}

form.addEventListener("submit", e => {

    e.preventDefault();
    const book = new Book(
        titleInput.value,
        authorInput.value,
        Number(pagesInput.value),
        readInput.checked
    );

    addBook(book);
    form.reset();
    dialog.close();
});

document.querySelector("#new-book-btn")
    .addEventListener("click", () => {
        dialog.showModal();
    });

searchInput.addEventListener("input", renderBooks);
filterInput.addEventListener("change", renderBooks);
sortInput.addEventListener("change", renderBooks);

function saveBooks() {
    localStorage.setItem(
        "books",
        JSON.stringify(library)
    );
}

function loadBooks() {
    const saved = JSON.parse(
        localStorage.getItem("books")
    );

    if (!saved) return;

    saved.forEach(book => {
        library.push(book);
    });
}
loadBooks();
renderBooks();
