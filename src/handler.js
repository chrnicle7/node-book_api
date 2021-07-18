const { nanoid } = require('nanoid');
const _ = require('lodash');
const books = require('./books');

// 1. Menampilkan seluruh buku dan by query
const getAllBooksHandler = (request, h) => {
    let getBooks = _.cloneDeep(books);

    const {name, reading, finished} = request.query;
    let bookByName = [];
    let bookByReading = [];
    let bookByFinished = [];
    if(name){
        bookByName = getBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

        if(bookByName.length){
            getBookByName = bookByName.map((book) => {
                return {
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }
            })
        }
    }
    if(reading){
        if(reading === '1'){
            bookByReading = getBooks.filter((book) => book.reading === true);
        }else if(reading === '0'){
            bookByReading = getBooks.filter((book) => book.reading === false);
        }else{
            bookByReading = _.cloneDeep(getBooks);
        }
    }
    if(finished){
        if(finished === '1'){
            bookByFinished = getBooks.filter((book) => book.finished === true);
        }else if(finished === '0'){
            bookByFinished = getBooks.filter((book) => book.finished === false);
        }else{
            bookByFinished = _.cloneDeep(getBooks);
        }
    }

    // Untuk menangani
    //  http://localhost:<port>/books?name=<nama>&finished=<0/1>
    //  http://localhost:<port>/books?name=<nama>&reading=<0/1>
    if(name){
        getBooks = _.cloneDeep(bookByName);
        if(reading){
            getBooks = _.intersection(bookByName, bookByReading);
        }else if(finished){
            getBooks = _.intersection(bookByName, bookByFinished);
        }
    }else if(reading){
        getBooks = _.cloneDeep(bookByReading);
    }else if(finished){
        getBooks = _.cloneDeep(bookByFinished);
    }

    return h.response({
        status: 'success',
        data: {
            books: getBooks.map((book) => {
                return {  
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }
            }),
        }
    }).code(200);
};

// 2. Menambahkan buku
const addBookHandler = (request, h) => {
    if(request.payload){    
        const {
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
        } = JSON.parse(request.payload);
    
        if(!name){
            return h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku'
            }).code(400);
        }
        if(readPage > pageCount){
            return h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            }).code(400);
        }
        if(readPage < 0 || pageCount < 0){
            return h.response({
                status: 'fail',
                message: 'Buku gagal ditambahkan'
            }).code(500);
        }

        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updateAt = createdAt;

        books.push({
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            createdAt,
            updateAt,
        });

        const isSuccess = books.filter((book) => book.id === id).length > 0;
        if(isSuccess){
            return h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id
                }
            }).code(201);
        }
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan'
    }).code(500);
};

// 3. Menampilkan detail buku
const getBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const book = books.filter((book) => book.id === bookId)[0];

    if(book){
        return h.response({
            status: 'success',
            data: book
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    }).code(404);
};

// 4. Mengubah data buku
const editBookByIdHandler = (request, h) => {
    if(request.payload){
        const {bookId} = request.params;
        const {
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        } = JSON.parse(request.payload);

        if(!name){
            return h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku'
            }).code(400);
        }
        if(readPage > pageCount){
            return h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            }).code(400);
        }
        
        const index = books.findIndex((book) => book.id === bookId);
        if(index !== -1){
            const updateAt = new Date().toISOString();

            books[index] = {
                ...books[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
            };

            return h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            }).code(200);
        
        }else{
            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Id tidak ditemukan'
            }).code(404);
        
        }
    }
    
    return h.response({
        status: 'fail',
        message: 'Buku gagal diedit'
    }).code(500);

};

// 4. Menghapus Buku
const deleteBookByIdHandler = (request, h) =>{
    const {bookId} = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if(index !== -1){
        books.splice(index, 1);

        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        }).code(200);
    }else{
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        }).code(404);
    }
};


module.exports = {
    getAllBooksHandler,
    addBookHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler   
}