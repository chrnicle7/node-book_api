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

    const response = h.response({
        status: 'success',
        data: {
            books: allBooks,
        }
    });
    response.code(200);
    return response;
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
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku'
            });
            response.code(400);
            return response;
        }
        if(readPage > pageCount){
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            });
            response.code(400);
            return response;
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
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id
                }
            });
            response.code(201);
            return response;
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan'
    });
    response.code(500);
    return response;
};

// 3. Menampilkan detail buku
const getBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const book = books.filter((book) => book.id === bookId)[0];

    if(book){
        const response = h.response({
            status: 'success',
            data: book
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
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
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku'
            });
            response.code(400);
            return response;
        }
        if(readPage > pageCount){
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            });
            response.code(400);
            return response;
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

            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            });
            response.code(200);
            return response;
        }else{
            const response = h.response({
                status: 'fail',
                message: 'Buku tidak ditemukan'
            });
            response.code(404);
            return response;
        }
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal diedit'
    });
    response.code(500);
    return response;
};

// 4. Menghapus Buku
const deleteBookByIdHandler = (request, h) =>{
    const {bookId} = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if(index !== -1){
        books.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }else{
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        });
        response.code(404);
        return response;
    }
};

module.exports = {
    getAllBooksHandler,
    addBookHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
}