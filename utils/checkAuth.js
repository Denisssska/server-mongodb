import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    let token = (req.headers.authorization || '')
    const regex = /Bearer\s?/; //удалили bearer из токена
    let token2 = token.replace(regex, '')
    if (token2) {
        try {
            const decoded = jwt.verify(token2, 'secretKey123')
            req.userId = decoded._id
            next()
        } catch (e) {
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }
}