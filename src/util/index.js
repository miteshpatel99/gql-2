module.exports.prepare = (o) => {
    o._id = o._id.toString()
    return o
}
