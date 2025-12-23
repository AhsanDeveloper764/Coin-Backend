// class BlogDetails{
//     constructor(blogDetail){
//         this._id = blogDetail._id,
//         this.content = blogDetail.content,
//         this.title = blogDetail.title,
//         this.photo = blogDetail.photoPath,
//         this.createdAt = blogDetail.createdAt,
//         this.authorName = blogDetail.author.name,
//         this.authorUsername = blogDetail.author.username
//     }
// }

// module.exports = BlogDetails

class BlogDetails {
    constructor(blogDetail){
        this._id = blogDetail._id;
        this.content = blogDetail.content;
        this.title = blogDetail.title;
        this.photo = blogDetail.photoPath;
        this.createdAt = blogDetail.createdAt;
        this.authorName = blogDetail.author ? blogDetail.author.name : null;
        this.authorUsername = blogDetail.author ? blogDetail.author.username : null;
    }
}
module.exports = BlogDetails;
