const Joi = require("joi");
const model = require("../models/comment");
const commentdto = require("../dto/comment-details")
const mongodbIdPattern = /^[a-fA-F0-9]{24}$/;

const commnts = {
    async create(req,resp,next){
        const createCommentSchmea = Joi.object({
            content:Joi.string().required(),
            author:Joi.string().regex(mongodbIdPattern).required(),
            blog:Joi.string().regex(mongodbIdPattern).required()
        })

        const {error} = createCommentSchmea.validate(req.body);
        if(error){
            return next(error)
        }

        const {content,author,blog} = req.body;
        try{
            const newComment = new model({
                content,author,blog
            })

            await newComment.save();
        }
        catch(error){
            return next(error)
        }
        const dto = new commentdto(newComment);
        return resp.status(201).json({ comment: dto });
    },
    async getById(req,resp,next){
        const commentGet = Joi.object({
            id:Joi.string().regex(mongodbIdPattern).required(),    
        })

        const {error} = commentGet.validate(req.params);
        if(error){
            return next(error)
        }

        const {id} = req.params;
        let Cmnt;
        try{
            Cmnt = await model.find({blog:id}).populate("author")
        }
        catch(error){
            return next(error)
        }

        let commentsDTO = []
        for (let i=0 ; i<Cmnt.length; i++){
            const obj = new commentdto(Cmnt[i])
            commentsDTO.push(obj)
        }
        return resp.status(201).json({FindComment:commentsDTO})
    }
}

module.exports = commnts


// testing ka liya author ma user kee id
// or blog ma blod kee id