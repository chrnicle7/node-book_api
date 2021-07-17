const { nanoid } = require('nanoid');
const books = require('./books');

// 1. Menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
    let allBooks = books.map((book) => {
        return {
            id: book.id,
            name: book.name,
            publisher: book.publisher
        }
    })

    return h.response({
        status: 'success',
        data: {
            books: allBooks,
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

        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updateAt = createdAt;
        console.log(updateAt);

        books.push({
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
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
                message: 'Buku tidak ditemukan'
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
            message: 'Buku tidak ditemukan'
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